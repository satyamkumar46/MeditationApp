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
    const token = await getToken();

    console.log("TOKEN:", token);

    const baseConfig = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    if (baseConfig.body instanceof FormData) {
      delete baseConfig.headers["Content-Type"];
    }

    const executeRequest = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        const response = await fetch(url, {
          ...baseConfig,
          signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw {
            message: data.message || "Request failed",
            status: response.status,
            code: `HTTP_${response.status}`,
            details: data,
          };
        }

        return {
          data,
          status: response.status,
          success: true,
        };
      } finally {
        clearTimeout(timeoutId);
      }
    };

    try {
      return await this._retryRequest(
        executeRequest,
        API_CONFIG.RETRY_COUNT,
        API_CONFIG.RETRY_DELAY,
      );
    } catch (error) {
      // ❌ Don't retry client errors (400–499)
      if (error.status && error.status < 500) {
        throw error;
      }

      // ⏱ timeout
      if (error.name === "AbortError") {
        throw {
          message: "Request timed out. Try again.",
          code: "TIMEOUT",
          status: 408,
        };
      }

      // 🌐 network error
      throw {
        message: error.message || "Network error",
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
      body: body instanceof FormData ? body : JSON.stringify(body),
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
      // ❌ Don't retry client errors
      if (error.status && error.status < 500) {
        throw error;
      }

      if (retries <= 0) throw error;

      await new Promise((res) => setTimeout(res, delay));

      return this._retryRequest(fn, retries - 1, delay);
    }
  }
}

// Singleton instance
const apiClient = new ApiClient();

export default apiClient;
