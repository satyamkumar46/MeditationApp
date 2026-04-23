import { getToken } from "../utility/storage";
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

    const token = await getToken();

    const config = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      signal: controller.signal,
    };
    if (config.body instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    try {
      const executeRequest = async () => {
        const response = await fetch(url, config);

        if (!response.ok) {
          throw await this._handleHttpError(response);
        }

        const result = await this._retryRequest(
          executeRequest,
          API_CONFIG.RETRY_COUNT,
          API_CONFIG.RETRY_DELAY,
        );

        clearTimeout(timeoutId);

        return result;
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        throw {
          message: "Request timed out. Please try again.",
          code: "TIMEOUT",
          status: 408,
        };
      }

      if (error.status && error.status < 500) {
        throw error; // Already formatted error
      }

      throw {
        message:
          error.message || "Network error. Please check your connection.",
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
      message:
        errorBody.message || `Request failed with status ${response.status}`,
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

  async _retryRequest(fn, retries, delay) {
    try {
      return await fn();
    } catch (error) {
      if (retries <= 0) throw error;

      await new Promise((res) => setTimeout(res, delay));

      return this._retryRequest(fn, retries - 1, delay);
    }
  }
}

// Singleton instance
const apiClient = new ApiClient();

export default apiClient;
