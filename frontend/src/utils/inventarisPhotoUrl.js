export function getInventarisPhotoUrl(photo) {
  if (typeof photo !== 'string' || !photo.trim()) return '';

  const value = photo.trim().replace(/\\/g, '/');
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  if (value.startsWith('/')) return value;
  return `/uploads/${value.replace(/^uploads\/+/i, '')}`;
}
