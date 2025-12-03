export function createSlug(title: string): string {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

export function extractIdFromSlug(slugSegment: string): number | null {
  if (!slugSegment) return null;
  
  const match = slugSegment.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

export function createSlugSegment(id: number | string, title: string): string {
  const slug = createSlug(title);
  return slug ? `${id}-${slug}` : String(id);
}

