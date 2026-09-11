import { fetchApi } from "./client";

export async function uploadResumes(files) {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }

  return fetchApi("/api/resumes", {
    method: "POST",
    body: formData,
  });
}

export async function getResumes() {
  return fetchApi("/api/resumes");
}

export async function getResume(id) {
  return fetchApi(`/api/resumes/${id}`);
}

export async function updateResume(id, resume) {
  return fetchApi(`/api/resumes/${id}`, {
    method: "PUT",
    body: JSON.stringify({ resume }),
  });
}

export async function deleteResume(id) {
  return fetchApi(`/api/resumes/${id}`, {
    method: "DELETE",
  });
}

// Candidates aliases
export const getCandidates = getResumes;
export const getCandidate = getResume;
export const updateCandidate = updateResume;
export const deleteCandidate = deleteResume;
