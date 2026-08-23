import { fetchApi } from "./client.js";

export async function getHealthStatus() {
  try {
    const data = await fetchApi("/health");
    return {
      status: data.status,
      checks: data.checks || {},
      healthy: data.status === "ok"
    };
  } catch (err) {
    return {
      status: "error",
      checks: {
        server: { status: "error" },
        database: { status: "error" },
        gemini: { status: "error" },
      },
      healthy: false,
      error: err.message
    };
  }
}
