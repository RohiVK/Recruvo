import { fetchApi } from "./client.js";

export async function getJobDescriptions() {
  const data = await fetchApi("/api/job-descriptions");
  return data.jobs || [];
}

export async function getJobDescription(id) {
  const data = await fetchApi(`/api/job-descriptions/${id}`);
  return data.job;
}

export async function createJobDescription(text) {
  const data = await fetchApi("/api/job-descriptions", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  return data.job;
}

export async function updateJobDescription(id, jobData) {
  const data = await fetchApi(`/api/job-descriptions/${id}`, {
    method: "PUT",
    body: JSON.stringify({ job: jobData }),
  });
  return data.job;
}

export async function deleteJobDescription(id) {
  const data = await fetchApi(`/api/job-descriptions/${id}`, {
    method: "DELETE",
  });
  return data;
}
