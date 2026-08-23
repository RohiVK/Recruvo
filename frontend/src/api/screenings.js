import { fetchApi } from "./client.js";

export async function getScreenings({ resumeId, jdId } = {}) {
  let query = "";
  const params = new URLSearchParams();
  if (resumeId) params.append("resume_id", resumeId);
  if (jdId) params.append("jd_id", jdId);
  if (params.toString()) query = `?${params.toString()}`;

  const data = await fetchApi(`/api/screenings${query}`);
  return data.screenings || [];
}

export async function getScreening(id) {
  const data = await fetchApi(`/api/screenings/${id}`);
  return data.screening;
}

export async function createScreening(resumeId, jdId) {
  const data = await fetchApi("/api/screenings", {
    method: "POST",
    body: JSON.stringify({
      resume_id: Number(resumeId),
      jd_id: Number(jdId),
    }),
  });
  return data.screening;
}

export async function batchScreening(jdId, resumeIds, onProgress) {
  const results = [];
  const errors = [];
  
  for (let i = 0; i < resumeIds.length; i++) {
    const resumeId = resumeIds[i];
    if (onProgress) {
      onProgress({ current: i + 1, total: resumeIds.length, currentId: resumeId });
    }
    try {
      const screening = await createScreening(resumeId, jdId);
      results.push(screening);
    } catch (err) {
      errors.push({ resumeId, error: err.message });
    }
  }

  return { count: results.length, screenings: results, errors };
}

export async function updateScreening(id, score, reason) {
  const data = await fetchApi(`/api/screenings/${id}`, {
    method: "PUT",
    body: JSON.stringify({ score, reason }),
  });
  return data.screening;
}

export async function deleteScreening(id) {
  const data = await fetchApi(`/api/screenings/${id}`, {
    method: "DELETE",
  });
  return data;
}
