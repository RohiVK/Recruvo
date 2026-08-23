import { fetchApi } from "./client.js";

export async function getResumes() {
  const data = await fetchApi("/api/resumes");
  return data.resumes || [];
}

export async function getResume(id) {
  const data = await fetchApi(`/api/resumes/${id}`);
  return data.resume;
}

export async function uploadResumes(fileList) {
  const formData = new FormData();
  Array.from(fileList).forEach((file) => {
    formData.append("files", file);
  });

  const data = await fetchApi("/api/resumes", {
    method: "POST",
    body: formData,
  });
  return data;
}

export async function updateResume(id, resumeData) {
  const data = await fetchApi(`/api/resumes/${id}`, {
    method: "PUT",
    body: JSON.stringify({ resume: resumeData }),
  });
  return data.resume;
}

export async function deleteResume(id) {
  const data = await fetchApi(`/api/resumes/${id}`, {
    method: "DELETE",
  });
  return data;
}
