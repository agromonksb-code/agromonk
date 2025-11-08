export function resolveImageUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return '';
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://') || pathOrUrl.startsWith('data:')) {
    return pathOrUrl;
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  let origin = 'http://localhost:3001';
  try {
    const parsed = new URL(apiBase);
    origin = `${parsed.protocol}//${parsed.host}`;
  } catch {}

  if (pathOrUrl.startsWith('/')) {
    return origin + pathOrUrl;
  }
  return `${origin}/${pathOrUrl}`;
}


