import os
import time
from datetime import datetime, timedelta
from app.models import SessionLocal, Job
import threading
from app.appconfig import AppConfig


def cleanup_completed_jobs():
    """
    Cleanup routine to delete completed jobs and associated files after a set retention period.
    """
    while True:
        try:
            # Access the singleton instance
            config = AppConfig()

            # Create a database session
            db = SessionLocal()

            # Calculate expiration time
            expiration_time = datetime.now() - timedelta(
                seconds=config.retention_period
            )

            # Find completed jobs older than retention period
            jobs_to_delete = (
                db.query(Job)
                .filter(Job.status == "completed")
                .filter(Job.updated_at < expiration_time)
                .all()
            )

            for job in jobs_to_delete:
                # Delete output file if it exists
                if job.output_file and os.path.exists(job.output_file):
                    os.remove(job.output_file)

                # Delete input file if it exists
                if job.input_file and os.path.exists(job.input_file):
                    os.remove(job.input_file)

                # Remove job entry from the database
                db.delete(job)

            # Commit changes
            db.commit()
        except Exception as e:
            print(f"Cleanup error: {e}")
        finally:
            db.close()

        # Wait before the next cleanup run
        time.sleep(config.cleanup_interval)


# Start cleanup routine as a background thread
def start_cleanup_task():
    cleanup_thread = threading.Thread(target=cleanup_completed_jobs, daemon=True)
    cleanup_thread.start()
