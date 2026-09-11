const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get("content-type");
    let data = null;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { text };
      }
    }

    if (!response.ok) {
      const errorMessage =
        data?.error || data?.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      const netErr = new Error(
        "Unable to connect to Recruvo backend server. Please make sure the server is running on port 3000."
      );
      netErr.isNetworkError = true;
      throw netErr;
    }
    throw err;
  }
}

export { API_BASE_URL };
