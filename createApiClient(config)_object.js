export function createApiClient(config = {}) {
  const {
    baseURL = '',
    headers = {},
    timeout = 0,
    withCredentials = false,
    retry = { retries: 0, delay: (attempt) => Math.min(1000 * Math.pow(2, attempt - 1), 30000) },
    parseResponse = true
  } = config;

  const defaultHeaders = { Accept: 'application/json', ...(headers || {}) };
  const globalTimeout = typeof timeout === 'number' ? timeout : 0;

  async function request(method, url, options = {}) {
    const { params, body, headers: reqHeaders = {}, timeout: localTimeout } = options;

    // Build full URL
    let fullUrl;
    if (baseURL) {
      try {
        fullUrl = new URL(url, baseURL).toString();
      } catch {
        fullUrl = url;
      }
    } else {
      fullUrl = (typeof url === 'string') ? url : String(url);
    }

    // Attach query params if provided
    if (params && typeof params === 'object') {
      try {
        const parsed = new URL(fullUrl, 'http://dummy').toString();
        const base = parsed.startsWith('http://') ? parsed : fullUrl;
        const urlObj = new URL(fullUrl, baseURL || undefined);
        Object.keys(params).forEach((k) => {
          const v = params[k];
          if (v !== undefined && v !== null) urlObj.searchParams.append(k, String(v));
        });
        fullUrl = urlObj.toString();
      } catch {
        // Fallback: manually append
        const qp = Object.keys(params)
          .filter((k) => params[k] !== undefined && params[k] !== null)
          .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(String(params[k]))}`)
          .join('&');
        if (qp) {
          fullUrl += (fullUrl.includes('?') ? '&' : '?') + qp;
        }
      }
    }

    const mergedHeaders = { ...defaultHeaders, ...reqHeaders };

    let fetchBody;
    if (body !== undefined && body !== null) {
      if (typeof body === 'string' || body instanceof FormData) {
        fetchBody = body;
      } else {
        fetchBody = JSON.stringify(body);
        if (!mergedHeaders['Content-Type'] && !mergedHeaders['content-type']) {
          mergedHeaders['Content-Type'] = 'application/json';
        }
      }
    }

    const effectiveTimeout = typeof localTimeout === 'number' ? localTimeout : globalTimeout;
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const signal = controller ? controller.signal : undefined;

    const fetchOpts = {
      method: String(method).toUpperCase(),
      headers: mergedHeaders,
      body: fetchBody,
      credentials: withCredentials ? 'include' : 'same-origin',
      signal
    };

    let timeoutId = null;
    if (controller && effectiveTimeout > 0) {
      timeoutId = setTimeout(() => controller.abort(), effectiveTimeout);
    }

    const maxRetries = typeof retry?.retries === 'number' ? retry.retries : 0;
    const onRetry = typeof retry?.onRetry === 'function' ? retry.onRetry : null;
    const delayFn = typeof retry?.delay === 'function' ? retry.delay : (attempt) => Math.min(1000 * Math.pow(2, attempt - 1), 30000);

    let attempt = 0;
    while (true) {
      attempt++;
      try {
        const res = await fetch(fullUrl, fetchOpts);
        if (timeoutId) clearTimeout(timeoutId);

        if (!res.ok) {
          let data = null;
          const ct = res.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            try { data = await res.json(); } catch { data = null; }
          } else {
            try { data = await res.text(); } catch { data = null; }
          }
          const err = new Error(`Request failed with status ${res.status}`);
          err.status = res.status;
          err.statusText = res.statusText;
          err.data = data;
          err.response = res;
          throw err;
        }

        if (!parseResponse) return res;
        const ct2 = res.headers.get('content-type') || '';
        if (ct2.includes('application/json')) {
          return await res.json();
        } else {
          return await res.text();
        }
      } catch (err) {
        if (controller && err.name === 'AbortError') {
          const timeoutError = new Error(`Request timed out after ${effectiveTimeout} ms`);
          timeoutError.code = 'ECONNABORTED';
          timeoutError.original = err;
          throw timeoutError;
        }

        if (attempt <= maxRetries) {
          if (onRetry) onRetry(err, attempt);
          const delay = delayFn(attempt);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
        throw err;
      }
    }
  }

  function buildUrl(url) {
    if (baseURL) {
      try {
        return new URL(url, baseURL).toString();
      } catch {
        return url;
      }
    }
    return (typeof url === 'string') ? url : String(url);
  }

  const client = {
    baseURL,
    headers: { ...defaultHeaders },
    timeout,
    withCredentials,
    request: (method, url, opts = {}) => request(method, buildUrl(url), opts),
    get: (url, opts = {}) => client.request('GET', url, { ...opts }),
    post: (url, body, opts = {}) => client.request('POST', url, { ...opts, body }),
    put: (url, body, opts = {}) => client.request('PUT', url, { ...opts, body }),
    patch: (url, body, opts = {}) => client.request('PATCH', url, { ...opts, body }),
    delete: (url, opts = {}) => client.request('DELETE', url, { ...opts }),
    setHeader: (name, value) => {
      defaultHeaders[name] = value;
      client.headers = { ...defaultHeaders };
    }
  };

  return client;
}