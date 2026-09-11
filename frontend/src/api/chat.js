import { fetchApi } from "./client";

export async function sendChatMessage({
  message,
  context = {},
  conversation = [],
}) {
  return fetchApi("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      message,
      context: {
        jobId: context.jobId ?? null,
        candidateId: context.candidateId ?? null,
        comparisonCandidateId: context.comparisonCandidateId ?? null,
      },
      conversation: conversation.map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      })),
    }),
  });
}
