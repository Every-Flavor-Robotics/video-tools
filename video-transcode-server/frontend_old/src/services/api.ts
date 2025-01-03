import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000",
});

export const fetchJobs = () => api.get("/jobs");
export const fetchSystemLoad = () => api.get("/system_load");
export const updateSettings = (data: any) => api.post("/settings", data);

export default api;
