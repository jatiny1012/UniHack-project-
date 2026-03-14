import { useKinshipStore } from "@/lib/store";

/**
 * Authenticated fetch wrapper.
 * Automatically reads the JWT token from the Zustand store
 * and attaches it as an Authorization: Bearer header.
 *
 * Usage:
 *   import { authFetch } from "@/lib/api";
 *   const data = await authFetch("/api/clusters?user_id=123");
 *   const data = await authFetch("/api/parse", { method: "POST", body: JSON.stringify({...}) });
 */
export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = useKinshipStore.getState().token;

  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Default to JSON content type for POST/PUT/PATCH
  if (
    options.method &&
    ["POST", "PUT", "PATCH"].includes(options.method.toUpperCase()) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Convenience: authFetch + parse JSON response.
 * Throws if response is not ok.
 */
export async function authFetchJSON<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await authFetch(url, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data as T;
}
