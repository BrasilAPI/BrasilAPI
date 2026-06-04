import axios from 'axios';

/**
 * Executes a quick health check to determine if an external service is available.
 * This prevents the test suite from failing or causing CI timeouts when the
 * external infrastructure drops connections (e.g. DNS issues, blockades).
 *
 * @param {string} url - The URL to ping
 * @param {string} serviceName - Human-readable name of the service (e.g., 'IBGE', 'CPTEC')
 * @param {object} options - Axios request options (method, headers, etc)
 * @returns {Promise<boolean>} - Returns `true` if the suite SHOULD BE SKIPPED
 */
export async function checkServiceHealth(url, serviceName, options = {}) {
  try {
    const response = await axios({
      method: options.method || 'get',
      url,
      timeout: options.timeout || 5000,
      headers: options.headers || {},
      data: options.data || undefined,
    });

    if (response.status === 200) {
      console.log(`✅ ${serviceName} service is available - running tests`);
      return false; // Do not skip tests
    }
  } catch (error) {
    const isNetworkOrServerError =
      error.code === 'ENOTFOUND' ||
      error.code === 'ECONNREFUSED' ||
      error.code === 'ECONNRESET' ||
      error.code === 'ETIMEDOUT' ||
      error.response?.status >= 500 ||
      (options.treat404AsDown && error.response?.status === 404);

    if (isNetworkOrServerError) {
      console.warn(
        `⚠️  ${serviceName} service unavailable (network/DNS/server issue) - skipping tests`
      );
    } else {
      console.warn(
        `⚠️  ${serviceName} service health check failed - skipping tests:`,
        error.message
      );
    }
  }

  // Default to skip on any error or non-200 status
  return true;
}

/**
 * Convenience method that automatically performs the health check
 * and returns the appropriate describe function (describe or describe.skip)
 * utilizing Vitest top-level await capabilities.
 */
export async function createDescribeIf(url, serviceName, options = {}) {
  // We need to import describe here or pass it, but better yet, we can import it directly from vitest
  const { describe } from 'vitest';
  const shouldSkip = await checkServiceHealth(url, serviceName, options);
  return shouldSkip ? describe.skip : describe;
}
