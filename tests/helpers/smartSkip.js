import axios from 'axios';
import { describe } from 'vitest';

/**
 * Network/infra error codes that indicate the external service is unreachable.
 * ONLY these conditions justify skipping tests.
 * Any other error (4xx contract break, unexpected response) should FAIL the tests.
 */
const INFRA_ERROR_CODES = new Set([
  'ENOTFOUND',    // DNS resolution failure
  'ECONNREFUSED', // Server actively refused the connection
  'ECONNRESET',   // Connection reset mid-flight
  'ETIMEDOUT',    // TCP connection timed out
  'ECONNABORTED', // Connection aborted (axios timeout)
]);

/**
 * Executes a quick health check to determine if an external service is available.
 * Only skips tests when the service is genuinely unreachable (infra failure).
 * Contract errors (unexpected status/body) will still FAIL the tests as intended.
 *
 * @param {string} url - The URL to ping
 * @param {string} serviceName - Human-readable name (e.g., 'IBGE', 'CPTEC')
 * @param {object} options
 * @param {number} [options.timeout=3000] - Request timeout in ms
 * @param {boolean} [options.treat404AsDown=false] - Treat 404 as infra failure (for provider-specific ISBN checks)
 * @returns {Promise<boolean>} `true` if the suite SHOULD BE SKIPPED
 */
export async function checkServiceHealth(url, serviceName, options = {}) {
  const timeout = options.timeout || 3000;

  try {
    const response = await axios.get(url, { timeout });

    // Any 2xx means the service is up — run the tests
    if (response.status >= 200 && response.status < 300) {
      console.log(`✅ ${serviceName} is available — running tests`);
      return false;
    }

    // Non-2xx but not an error (e.g. 3xx without follow) — still run, let tests judge
    console.log(`✅ ${serviceName} responded ${response.status} — running tests`);
    return false;
  } catch (error) {
    const code = error.code;
    const status = error.response?.status;

    const isInfraFailure =
      INFRA_ERROR_CODES.has(code) ||
      status >= 500 ||
      (options.treat404AsDown === true && status === 404);

    if (isInfraFailure) {
      const reason = code || `HTTP ${status}`;
      console.warn(
        `⚠️  ${serviceName} unreachable (${reason}) — skipping dependent tests`
      );
      return true; // Skip — genuine infra problem
    }

    // Any other error (4xx contract break, network issue we don't know) — DO NOT SKIP.
    // Let the tests run and fail with the real error so the team is alerted.
    console.warn(
      `⚠️  ${serviceName} health check returned an unexpected error (${code || `HTTP ${status}`}) — running tests anyway`
    );
    return false;
  }
}

/**
 * Convenience wrapper: performs the health check and returns the appropriate
 * Vitest describe function (describe or describe.skip).
 */
export async function createDescribeIf(url, serviceName, options = {}) {
  const shouldSkip = await checkServiceHealth(url, serviceName, options);
  return shouldSkip ? describe.skip : describe;
}
