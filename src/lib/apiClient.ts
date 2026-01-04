export type ApiErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

export interface ApiErrorDetails {
  code: ApiErrorCode;
  message: string;
  statusCode?: number;
  originalError?: unknown;
}

export class ApiException extends Error {
  public readonly code: ApiErrorCode;
  public readonly statusCode?: number;
  public readonly originalError?: unknown;

  constructor(details: ApiErrorDetails) {
    super(details.message);
    this.name = 'ApiException';
    this.code = details.code;
    this.statusCode = details.statusCode;
    this.originalError = details.originalError;

    Object.setPrototypeOf(this, ApiException.prototype);
  }

  static fromHttpStatus(statusCode: number, message?: string): ApiException {
    const errorMap: Record<number, { code: ApiErrorCode; defaultMessage: string }> = {
      400: { code: 'VALIDATION_ERROR', defaultMessage: 'Ungültige Anfrage' },
      401: { code: 'UNAUTHORIZED', defaultMessage: 'Nicht autorisiert' },
      403: { code: 'FORBIDDEN', defaultMessage: 'Zugriff verweigert' },
      404: { code: 'NOT_FOUND', defaultMessage: 'Nicht gefunden' },
      500: { code: 'SERVER_ERROR', defaultMessage: 'Serverfehler' },
      502: { code: 'SERVER_ERROR', defaultMessage: 'Bad Gateway' },
      503: { code: 'SERVER_ERROR', defaultMessage: 'Service nicht verfügbar' },
    };

    const errorInfo = errorMap[statusCode] || {
      code: 'UNKNOWN_ERROR' as ApiErrorCode,
      defaultMessage: 'Ein unbekannter Fehler ist aufgetreten',
    };

    return new ApiException({
      code: errorInfo.code,
      message: message || errorInfo.defaultMessage,
      statusCode,
    });
  }

  static networkError(originalError?: unknown): ApiException {
    return new ApiException({
      code: 'NETWORK_ERROR',
      message: 'Netzwerkfehler. Bitte überprüfe deine Internetverbindung.',
      originalError,
    });
  }

  static timeout(): ApiException {
    return new ApiException({
      code: 'TIMEOUT',
      message: 'Zeitüberschreitung. Bitte versuche es erneut.',
    });
  }

  isRetryable(): boolean {
    return ['NETWORK_ERROR', 'TIMEOUT', 'SERVER_ERROR'].includes(this.code);
  }

  toUserMessage(): string {
    const userMessages: Record<ApiErrorCode, string> = {
      NETWORK_ERROR: 'Keine Internetverbindung. Bitte überprüfe deine Verbindung.',
      TIMEOUT: 'Die Anfrage hat zu lange gedauert. Bitte versuche es erneut.',
      UNAUTHORIZED: 'Bitte melde dich erneut an.',
      FORBIDDEN: 'Du hast keine Berechtigung für diese Aktion.',
      NOT_FOUND: 'Die angeforderte Ressource wurde nicht gefunden.',
      VALIDATION_ERROR: 'Bitte überprüfe deine Eingaben.',
      SERVER_ERROR: 'Ein Serverfehler ist aufgetreten. Bitte versuche es später erneut.',
      UNKNOWN_ERROR: 'Ein unerwarteter Fehler ist aufgetreten.',
    };

    return userMessages[this.code];
  }
}

export interface WithErrorHandlingOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  onError?: (error: ApiException) => void;
}

const DEFAULT_OPTIONS: WithErrorHandlingOptions = {
  timeout: 30000,
  retries: 0,
  retryDelay: 1000,
};

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options: WithErrorHandlingOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: ApiException | null = null;
  let attempts = 0;

  while (attempts <= (opts.retries || 0)) {
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(ApiException.timeout()), opts.timeout);
      });

      const result = await Promise.race([fn(), timeoutPromise]);
      return result;
    } catch (error) {
      attempts++;

      if (error instanceof ApiException) {
        lastError = error;
      } else if (error instanceof TypeError && error.message.includes('Network')) {
        lastError = ApiException.networkError(error);
      } else if (error instanceof Error) {
        lastError = new ApiException({
          code: 'UNKNOWN_ERROR',
          message: error.message,
          originalError: error,
        });
      } else {
        lastError = new ApiException({
          code: 'UNKNOWN_ERROR',
          message: 'Ein unbekannter Fehler ist aufgetreten',
          originalError: error,
        });
      }

      if (opts.onError) {
        opts.onError(lastError);
      }

      const shouldRetry = lastError.isRetryable() && attempts <= (opts.retries || 0);

      if (shouldRetry) {
        await delay(opts.retryDelay || 1000);
      } else {
        throw lastError;
      }
    }
  }

  throw lastError || new ApiException({ code: 'UNKNOWN_ERROR', message: 'Unbekannter Fehler' });
}

export async function fetchWithErrorHandling(
  url: string,
  init?: RequestInit,
  options?: WithErrorHandlingOptions
): Promise<Response> {
  return withErrorHandling(async () => {
    const response = await fetch(url, init);

    if (!response.ok) {
      let errorMessage: string | undefined;

      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorBody.error;
      } catch {
        // Ignore JSON parse errors
      }

      throw ApiException.fromHttpStatus(response.status, errorMessage);
    }

    return response;
  }, options);
}
