import subprocess
from app.models import SessionLocal, Job
from app.appconfig import AppConfig


def convert_video(input_path: str, output_path: str, resolution: str, quality: int):

    cmd = [
        "ffmpeg",
        "-i",
        input_path,
        "-vf",
        f"scale={AppConfig().resolution},format=yuv422p10le",
        "-c:v",
        "prores_ks",
        "-profile:v",
        "0",
        "-qscale:v",
        str(AppConfig().quality),
        "-c:a",
        "pcm_s16le",
        output_path,
    ]
    subprocess.run(cmd, check=True)


def process_job(job_id, input_path, output_path, resolution, quality):
    # Create a new database session in the child process
    db = SessionLocal()
    job = db.query(Job).filter(Job.id == job_id).first()

    try:
        # Perform the conversion
        convert_video(input_path, output_path, resolution, quality)
        # Update job status
        job.status = "completed"
        job.output_file = output_path
    except Exception as e:
        job.status = "failed"
        job.error = str(e)
    finally:
        # Commit and close session
        db.commit()
        db.close()
