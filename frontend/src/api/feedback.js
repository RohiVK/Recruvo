import { fetchApi } from "./client";

export async function submitFeedback({ rating, type = "feedback", message }) {
  return fetchApi("/api/feedback", {
    method: "POST",
    body: JSON.stringify({ rating, type, message }),
  });
}

export async function getFeedbacks() {
  return fetchApi("/api/feedback");
}
