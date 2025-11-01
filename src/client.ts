import type { InvezgoConfig, ApiResponse, RequestOptions } from './types';

export class InvezgoError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public error?: string,
    public response?: any
  ) {
    super(message);
    this.name = 'InvezgoError';
    Object.setPrototypeOf(this, InvezgoError.prototype);
  }
}

export class HttpClient {
  public baseURL: string;
  public apiKey: string;
  private timeout: number;

  constructor(config: InvezgoConfig) {
    // Ensure baseURL doesn't have trailing slash since paths start with /
    const baseURL = config.baseURL || 'https://api.invezgo.com';
    this.baseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
    this.apiKey = config.apiKey;
    this.timeout = config.timeout || 30000;

    if (!this.apiKey) {
      throw new Error('API Key is required');
    }
  }

  private async request<T>(
    method: string,
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseURL}${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.timeout);

    try {
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      };

      const response = await fetch(url, {
        method,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 204 No Content
      if (response.status === 204) {
        return [] as any;
      }

      const data = await response.json().catch(() => ({}));

      // Handle error responses
      if (!response.ok) {
        throw new InvezgoError(
          response.status,
          data.message || response.statusText,
          data.error,
          data
        );
      }

      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new InvezgoError(408, 'Request timeout', 'Timeout');
      }

      if (error instanceof InvezgoError) {
        throw error;
      }

      throw new InvezgoError(
        500,
        error.message || 'Unknown error occurred',
        'InternalError',
        error
      );
    }
  }

  async get<T>(path: string, params?: Record<string, any>, options?: RequestOptions): Promise<T> {
    let url = path;
    
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, String(v)));
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
      url = `${path}?${searchParams.toString()}`;
    }

    return this.request<T>('GET', url, options);
  }

  async post<T>(path: string, body?: any, options?: RequestOptions): Promise<T> {
    const requestOptions: RequestOptions = {
      ...options,
      headers: {
        ...options?.headers,
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), requestOptions.timeout || this.timeout);

    try {
      const url = `${this.baseURL}${path}`;
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...requestOptions.headers,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 204) {
        return {} as any;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new InvezgoError(
          response.status,
          data.message || response.statusText,
          data.error,
          data
        );
      }

      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new InvezgoError(408, 'Request timeout', 'Timeout');
      }

      if (error instanceof InvezgoError) {
        throw error;
      }

      throw new InvezgoError(
        500,
        error.message || 'Unknown error occurred',
        'InternalError',
        error
      );
    }
  }

  async put<T>(path: string, body?: any, options?: RequestOptions): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options?.timeout || this.timeout);

    try {
      const url = `${this.baseURL}${path}`;
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      };

      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 204) {
        return {} as any;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new InvezgoError(
          response.status,
          data.message || response.statusText,
          data.error,
          data
        );
      }

      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new InvezgoError(408, 'Request timeout', 'Timeout');
      }

      if (error instanceof InvezgoError) {
        throw error;
      }

      throw new InvezgoError(
        500,
        error.message || 'Unknown error occurred',
        'InternalError',
        error
      );
    }
  }

  async patch<T>(path: string, body?: any, options?: RequestOptions): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options?.timeout || this.timeout);

    try {
      const url = `${this.baseURL}${path}`;
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      };

      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 204) {
        return {} as any;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new InvezgoError(
          response.status,
          data.message || response.statusText,
          data.error,
          data
        );
      }

      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new InvezgoError(408, 'Request timeout', 'Timeout');
      }

      if (error instanceof InvezgoError) {
        throw error;
      }

      throw new InvezgoError(
        500,
        error.message || 'Unknown error occurred',
        'InternalError',
        error
      );
    }
  }

  async delete<T>(path: string, params?: Record<string, any>, options?: RequestOptions): Promise<T> {
    let url = path;
    
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, String(v)));
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
      url = `${path}?${searchParams.toString()}`;
    }

    return this.request<T>('DELETE', url, options);
  }
}

