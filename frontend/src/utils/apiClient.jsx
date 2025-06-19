// src/utils/apiClient.js

/**
 * Universal fetch wrapper with timeout and JSON handling.
 *
 * @param {string} url - The endpoint (e.g., "/api/auth/login").
 * @param {Object} options - Fetch config (method, headers, body, etc).
 * @param {number} timeoutMs - Timeout in milliseconds (default 5000ms).
 * @returns {Promise<{ data?: any, error?: string, slowNetwork?: boolean }>}
 * 
 */

export async function apiClient(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      return { error: data?.message || `Error ${response.status}`, slowNetwork: false };
    }

    return { data, slowNetwork: false };
  } catch (error) {
    if (error.name === 'AbortError') {
      return { error: 'Request timed out (slow network)', slowNetwork: true };
    }
    return { error: error.message || 'Unknown error', slowNetwork: false };
  } finally {
    clearTimeout(timeoutId);
  }
}
