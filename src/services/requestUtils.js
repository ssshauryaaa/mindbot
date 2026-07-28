const DEFAULT_TIMEOUT_MS = 12000;
const DEFAULT_RETRIES = 1;

export async function withTimeout(taskFactory, timeoutMs = DEFAULT_TIMEOUT_MS, timeoutLabel = 'Request timed out') {
  const timeoutPromise = new Promise((_, reject) => {
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      reject(new Error(timeoutLabel));
    }, timeoutMs);
  });

  return await Promise.race([taskFactory(), timeoutPromise]);
}

export async function retryAsync(taskFactory, retries = DEFAULT_RETRIES, retryDelayMs = 450) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await taskFactory(attempt);
    } catch (err) {
      lastError = err;
      if (attempt >= retries) break;
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs * (attempt + 1)));
    }
  }
  throw lastError;
}

export async function fetchJsonWithTimeout(url, init = {}, options = {}) {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    retries = DEFAULT_RETRIES,
    retryDelayMs = 450,
    timeoutLabel = `Request timed out after ${DEFAULT_TIMEOUT_MS}ms`,
  } = options;

  return await retryAsync(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      return response;
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error(timeoutLabel);
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }, retries, retryDelayMs);
}
