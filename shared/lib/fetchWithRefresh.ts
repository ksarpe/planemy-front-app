import { refreshToken } from "../api/auth";

/**
 * Enhanced fetch that automatically handles token refresh on 401 errors
 *
 * Usage: Replace `fetch(url, options)` with `fetchWithRefresh(url, options)`
 *
 * How it works:
 * 1. Makes the initial request
 * 2. If response is 401 (unauthorized), attempts to refresh the access token
 * 3. Retries the original request with the new token
 * 4. If refresh fails, throws the error (user needs to log in)
 */
export async function fetchWithRefresh(url: string | URL, options?: RequestInit): Promise<Response> {
  // Make the initial request
  let response = await fetch(url, options);

  // If we get a 401 (unauthorized), try to refresh the token
  if (response.status === 401) {
    try {
      // Attempt to refresh the access token
      await refreshToken();

      // Retry the original request with the new token
      response = await fetch(url, options);
    } catch (error) {
      // If refresh fails, throw the original 401 error
      // This will trigger the auth flow (redirect to login)
      throw error;
    }
  }

  return response;
}
