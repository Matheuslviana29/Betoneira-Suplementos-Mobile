function isPrivateIpv4(hostname) {
  const parts = hostname.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false;
  }

  return (
    parts[0] === 10 ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168)
  );
}

function isLocalDevelopmentOrigin(origin) {
  try {
    const url = new URL(origin);
    return (
      ['http:', 'https:'].includes(url.protocol) &&
      (url.hostname === 'localhost' ||
        url.hostname === '127.0.0.1' ||
        url.hostname === '[::1]' ||
        isPrivateIpv4(url.hostname))
    );
  } catch {
    return false;
  }
}

export function isCorsOriginAllowed(origin, { allowedOrigins, nodeEnvironment }) {
  if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return true;
  return nodeEnvironment === 'development' && isLocalDevelopmentOrigin(origin);
}
