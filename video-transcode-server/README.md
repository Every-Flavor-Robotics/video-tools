# Video Transcode Server

## Overview
This project implements a **Dockerized FastAPI server** that provides endpoints for:
1. Uploading video files.
2. Converting videos into proxy formats optimized for playback.
3. Monitoring system utilization (CPU, memory) in real-time.
4. Managing job statuses for video processing.
5. Dynamically configuring server settings (e.g., resolution, quality, cleanup interval).

The frontend is built using **Next.js 15** with **Chakra UI 3** for displaying job statuses, system utilization, and configurable settings.

---

## Features
1. **Backend:**
   - Built with FastAPI.
   - Uses SQLite for job persistence.
   - Provides REST endpoints for job submission, status updates, and file downloads.
   - Allows dynamic updates to server settings using a Singleton configuration model (`AppConfig`).
   - Includes automatic cleanup of completed jobs based on configurable retention policies.
2. **Frontend:**
   - Built with Next.js 15 and Chakra UI 3.
   - Displays job statuses in real-time (updated every 1 second).
   - Displays system utilization in real-time (CPU and memory stats updated every 1 second).
   - Provides a settings form for updating server configurations.
3. **Dockerized Environment:**
   - Easily deployable with Docker Compose.
   - Supports volume mapping for persistent storage.
4. **Concurrency:**
   - Uses `ThreadPoolExecutor` for handling video processing tasks.
   - Optimized to handle simultaneous uploads and status polling.

---

## Known Issues
1. **Blocking Behavior During Uploads:**
   - Frequent polling of system utilization (1-second intervals) appears to block or delay video uploads.
   - Root Cause: Possible thread pool contention or Global Interpreter Lock (GIL) conflicts.
   - Proposed Fix:
     - Use separate `ThreadPoolExecutors` for uploads and polling.
     - Optimize polling frequency in the frontend to 5 seconds.
     - Consider switching to fully async processing for uploads.
2. **Form Field Clearing Behavior:**
   - In the frontend, clearing `NumberInput` fields in the settings form temporarily breaks parsing until the field is refocused and re-entered.
   - Root Cause: Chakra UI's `NumberInput` behavior when handling empty fields.
   - Proposed Fix:
     - Use empty string state with validation checks and fallback values on `onBlur` events.
3. **Job Cleanup Timing:**
   - The job cleanup thread uses fixed intervals and retention policies but doesn't dynamically update when server settings are changed.
   - Proposed Fix:
     - Refactor cleanup logic to re-read settings from the `AppConfig` singleton on each iteration.
4. **CORS Issues for File Uploads:**
   - Uploads fail intermittently when the GUI is open, possibly due to mismatched preflight headers or CORS misconfiguration.
   - Proposed Fix:
     - Verify CORS middleware settings and HTTP methods allowed.
     - Test with different browser configurations.
5. **Performance Under Load:**
   - System may struggle under concurrent uploads and conversions due to shared resource contention.
   - Proposed Fix:
     - Implement a task queue using Celery or RQ for processing jobs asynchronously.

---

## Next Steps
- Refactor the backend to fully leverage async operations for uploads and processing.
- Introduce a dedicated task queue with workers for video conversions.
- Optimize frontend polling intervals for reduced server load.
- Test and validate CORS and network configurations.
- Add unit tests for backend and frontend components.

---

## How to Run
### Backend
1. Build and run the Docker container:
   ```bash
   docker-compose up --build
   ```
2. Access FastAPI documentation at:
   [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Access the frontend at:
   [http://localhost:3000](http://localhost:3000)

---

## API Endpoints
1. **File Upload:**
   ```http
   POST /upload/
   ```
2. **Convert Video:**
   ```http
   POST /convert/
   ```
3. **Job Status:**
   ```http
   GET /status/{job_id}/
   ```
4. **Download File:**
   ```http
   GET /download/{job_id}/
   ```
5. **System Utilization:**
   ```http
   GET /system_load/
   ```
6. **Update Settings:**
   ```http
   POST /settings/
   ```
7. **Fetch Settings:**
   ```http
   GET /settings/
   ```

---

## Final Notes
This README summarizes the current state of the project, outlines existing bugs, and provides directions for future improvements. Refer to the code comments and logs for deeper insights into specific errors.

