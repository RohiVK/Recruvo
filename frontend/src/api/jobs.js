import { fetchApi } from "./client";

export async function createJobDescription(text) {
  return fetchApi("/api/job-descriptions", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export async function uploadJobDescriptionFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  return fetchApi("/api/job-descriptions/upload", {
    method: "POST",
    body: formData,
  });
}

export async function getJobDescriptions() {
  return fetchApi("/api/job-descriptions");
}

export async function getJobDescription(id) {
  return fetchApi(`/api/job-descriptions/${id}`);
}

export async function updateJobDescription(id, job) {
  return fetchApi(`/api/job-descriptions/${id}`, {
    method: "PUT",
    body: JSON.stringify({ job }),
  });
}

export async function deleteJobDescription(id) {
  return fetchApi(`/api/job-descriptions/${id}`, {
    method: "DELETE",
  });
}
