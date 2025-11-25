export function resolveImageUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return '';

  // already full URL
  if (pathOrUrl.startsWith('http') || pathOrUrl.startsWith('data:')) {
    return pathOrUrl;
  }

  const base = process.env.NEXT_PUBLIC_IMAGE_URL || 'https://api.agromonk.com';

  // If backend returns only filename → add /uploads/
  if (!pathOrUrl.startsWith('/uploads')) {
    return `${base}/uploads/${pathOrUrl}`;
  }

  return `${base}${pathOrUrl}`;
}
