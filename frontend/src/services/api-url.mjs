const API_PATH = '/api/v1';
const API_PORT = 3333;

function extractHostname(hostUri) {
  if (!hostUri) return null;

  try {
    const url = new URL(hostUri.includes('://') ? hostUri : `http://${hostUri}`);
    return url.hostname.replace(/^\[|\]$/g, '');
  } catch {
    return null;
  }
}

function formatHostname(hostname) {
  return hostname.includes(':') ? `[${hostname}]` : hostname;
}

export function resolveApiUrl({ browserHostname, configuredUrl, hostUri, platform }) {
  if (configuredUrl?.trim()) return configuredUrl.trim().replace(/\/$/, '');

  if (platform === 'web') {
    const hostname = browserHostname?.replace(/^\[|\]$/g, '') || 'localhost';
    return `http://${formatHostname(hostname)}:${API_PORT}${API_PATH}`;
  }

  const metroHostname = extractHostname(hostUri);
  if (metroHostname) {
    return `http://${formatHostname(metroHostname)}:${API_PORT}${API_PATH}`;
  }

  const fallbackHostname = platform === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${fallbackHostname}:${API_PORT}${API_PATH}`;
}
