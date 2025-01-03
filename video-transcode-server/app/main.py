from fastapi import FastAPI, UploadFile, Form, Depends
from fastapi.responses import FileResponse
from concurrent.futures import ProcessPoolExecutor
import uuid
import os
import psutil
from app.tasks import process_job
from app.models import SessionLocal, Job
from app.cleanup import start_cleanup_task
import threading

app = FastAPI()

RESULT_DIR = "app/temp"
os.makedirs(RESULT_DIR, exist_ok=True)

executor = ProcessPoolExecutor()

start_cleanup_task()


# Dependency: Get Database Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/upload/")
async def upload_file(file: UploadFile, db: SessionLocal = Depends(get_db)):
    file_id = str(uuid.uuid4())
    input_path = os.path.join(RESULT_DIR, f"{file_id}_{file.filename}")

    with open(input_path, "wb") as buffer:
        buffer.write(await file.read())

    # Create job entry in DB
    job = Job(id=file_id, input_file=input_path, status="uploaded")
    db.add(job)
    db.commit()

    return {"file_id": file_id}


@app.post("/convert/")
async def convert(
    file_id: str = Form(...),
    resolution: str = Form("1280x720"),
    quality: int = Form(9),
    db: SessionLocal = Depends(get_db),
):
    # Fetch job from database
    job = db.query(Job).filter(Job.id == file_id).first()
    if not job or job.status != "uploaded":
        return {"error": "Invalid file ID"}

    # Update status to 'processing'
    job.status = "processing"
    db.commit()

    input_path = job.input_file
    output_path = os.path.join(RESULT_DIR, f"{file_id}_proxy.mov")

    # Submit the conversion job (no db session passed here)
    executor.submit(process_job, file_id, input_path, output_path, resolution, quality)

    return {"job_id": file_id}


@app.get("/status/{job_id}/")
async def status(job_id: str, db: SessionLocal = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        return {"status": "not found"}
    return {"status": job.status, "error": job.error}


@app.get("/download/{job_id}/")
async def download(job_id: str, db: SessionLocal = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job or job.status != "completed":
        return {"error": "File not ready"}
    filename = os.path.basename(job.output_file)
    return FileResponse(
        job.output_file,
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@app.get("/system_load/")
async def system_load():
    cpu_usage = psutil.cpu_percent(interval=1)
    memory_info = psutil.virtual_memory()
    return {
        "cpu_usage": f"{cpu_usage}%",
        "memory_usage": f"{memory_info.percent}%",
        "total_memory": f"{memory_info.total / (1024 ** 3):.2f} GB",
        "available_memory": f"{memory_info.available / (1024 ** 3):.2f} GB",
    }


@app.get("/jobs/")
async def list_jobs(db: SessionLocal = Depends(get_db)):
    jobs = db.query(Job).all()
    return [{"id": job.id, "status": job.status, "error": job.error} for job in jobs]


@app.post("/settings/")
async def update_settings(
    resolution: str = Form("1280x720"),
    quality: int = Form(9),
    cleanup_interval: int = Form(60),
    retention_period: int = Form(3600),
):
    global CLEANUP_INTERVAL, RETENTION_PERIOD
    CLEANUP_INTERVAL = cleanup_interval
    RETENTION_PERIOD = retention_period
    return {
        "resolution": resolution,
        "quality": quality,
        "cleanup_interval": cleanup_interval,
        "retention_period": retention_period,
    }
