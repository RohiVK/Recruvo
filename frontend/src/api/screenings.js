import { fetchApi } from "./client";

export async function createScreening(resumeId, jdId) {
  return fetchApi("/api/screenings", {
    method: "POST",
    body: JSON.stringify({
      resume_id: resumeId,
      jd_id: jdId,
    }),
  });
}

export async function getScreenings({ resumeId, jdId } = {}) {
  const params = new URLSearchParams();
  if (resumeId) params.append("resume_id", resumeId);
  if (jdId) params.append("jd_id", jdId);

  const query = params.toString() ? `?${params.toString()}` : "";
  return fetchApi(`/api/screenings${query}`);
}

export async function getScreening(id) {
  return fetchApi(`/api/screenings/${id}`);
}

export async function updateScreening(id, data) {
  return fetchApi(`/api/screenings/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteScreening(id) {
  return fetchApi(`/api/screenings/${id}`, {
    method: "DELETE",
  });
}
