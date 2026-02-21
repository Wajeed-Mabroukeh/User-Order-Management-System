import { API_BASE_URL } from "../config/env";
import { ApiErrorResponse } from "../types/api";

export class ApiError extends Error {
  status: number;
  details?: ApiErrorResponse;

  constructor(message: string, status: number, details?: ApiErrorResponse) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions<TBody> {
  method?: HttpMethod;
  token?: string | null;
  body?: TBody;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

async function parseErrorResponse(response: Response): Promise<ApiErrorResponse | undefined> {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return undefined;
  }

  try {
    return (await response.json()) as ApiErrorResponse;
  } catch {
    return undefined;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof TypeError) {
    return "Cannot reach backend API. Start backend on http://localhost:8080 or check VITE_API_BASE_URL.";
  }

  if (error instanceof ApiError) {
    if (error.details?.validationErrors) {
      return Object.values(error.details.validationErrors).join(" | ");
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

export async function httpRequest<TResponse, TBody = unknown>(
  path: string,
  options: RequestOptions<TBody> = {}
): Promise<TResponse> {
  const { method = "GET", token = null, body, headers, signal } = options;
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal
    });
  } catch {
    throw new ApiError(
      "Cannot reach backend API. Start backend on http://localhost:8080 or check VITE_API_BASE_URL.",
      0
    );
  }

  if (!response.ok) {
    const parsedError = await parseErrorResponse(response);
    const message = parsedError?.message ?? `Request failed (${response.status})`;
    throw new ApiError(message, response.status, parsedError);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return (await response.json()) as TResponse;
  }

  return (await response.text()) as TResponse;
}
