export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

export class ApiError extends Error {
  public readonly code: string;
  public readonly fields?: Record<string, string>;
  public readonly status: number;

  constructor(status: number, code: string, message: string, fields?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fields = fields;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export async function httpClient<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const errorBody = body as ApiErrorResponse | null;
    const code = errorBody?.error?.code || "HTTP_ERROR";
    const message = errorBody?.error?.message || response.statusText || "Request failed";
    const fields = errorBody?.error?.fields;
    throw new ApiError(response.status, code, message, fields);
  }

  return body as T;
}
