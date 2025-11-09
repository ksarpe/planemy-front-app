/**
 * API Configuration
 *
 * This file manages the base API URL based on the environment.
 * In development, it uses import.meta.env.VITE_API_URL or falls back to localhost.
 * In production, it should use the Railway URL.
 */

// Get API URL from environment variable, fallback to localhost for development
export const API_BASE_URL =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : "http://localhost:8080";

export const API_VERSION = "v1";

// Full API path
export const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;

// Helper function to build API endpoints
export function buildApiUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${API_URL}/${cleanPath}`;
}
