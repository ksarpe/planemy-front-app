/**
 * API Configuration
 *
 * Używamy ścieżki względnej. To pozwala proxy (w Vite lokalnie,
 * w Vercel/Railway w produkcji) na poprawne przekierowanie zapytań.
 */

export const API_VERSION = "v1";

// API_BASE_URL powinno być pustym stringiem, aby ścieżka była względna
// od roota domeny (np. /api/v1/...)
export const API_BASE_URL = "";

// export const API_URL będzie teraz "/api/v1"
export const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;

// Helper function to build API endpoints
export function buildApiUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${API_URL}/${cleanPath}`;
}
