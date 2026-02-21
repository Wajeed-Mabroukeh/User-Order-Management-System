const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

// Default to relative /api so Vite proxy can forward requests to backend in dev.
export const API_BASE_URL = configuredBaseUrl && configuredBaseUrl.length > 0 ? configuredBaseUrl : "/api";
