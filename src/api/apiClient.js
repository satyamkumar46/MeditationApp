/**
 * API Client - Centralized HTTP client for all API requests.
 *
 * Features:
 * - Base URL configuration
 * - Default headers
 * - Request/Response interceptors
 * - Timeout handling
 * - Error normalization
 */

import { API_CONFIG } from "./config";

class ApiClient {
  constructor(baseURL = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    this.timeout = API_CONFIG.TIMEOUT;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const config = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this._handleHttpError(response);
      }

      const data = await response.json();
      return { data, status: response.status, success: true };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        throw {
          message: "Request timed out. Please try again.",
          code: "TIMEOUT",
          status: 408,
        };
      }

      if (error.code) {
        throw error; // Already formatted error
      }

      throw {
        message: error.message || "Network error. Please check your connection.",
        code: "NETWORK_ERROR",
        status: 0,
      };
    }
  }

  /**
   * Handle HTTP error responses
   */
  async _handleHttpError(response) {
    let errorBody = {};
    try {
      errorBody = await response.json();
    } catch {
      // Response body is not JSON
    }

    return {
      message: errorBody.message || `Request failed with status ${response.status}`,
      code: `HTTP_${response.status}`,
      status: response.status,
      details: errorBody,
    };
  }

  // HTTP Method shortcuts
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }
}

// Singleton instance
const apiClient = new ApiClient();

export default apiClient;
