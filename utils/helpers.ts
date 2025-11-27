export const noop = (): void => {};

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export const formatPrice = (price: string | number): string => {
  const str = String(price);
  if (str.includes('.') && /^0+$/.test(str.split('.')[1])) {
    return str.split('.')[0];
  }
  return str;
};

export const getInitials = (name?: string): string => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  const initials = parts
    .slice(0, 2)
    .map(p => p[0])
    .join('');
  return initials.toUpperCase();
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const cleanHex = hex.replace('#', '');
  if (!/^[0-9A-F]{6}$/i.test(cleanHex)) {
    return null;
  }
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
};

export const withOpacity = (color: string, opacity: number): string => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const clampedOpacity = Math.max(0, Math.min(1, opacity));

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clampedOpacity})`;
};

export const areCartsEqual = (
  cart1: { id: number; countInCart: number }[],
  cart2: { id: number; countInCart: number }[],
): boolean => {
  if (cart1.length !== cart2.length) return false;

  const map = new Map(cart1.map(i => [i.id, i.countInCart]));

  for (const { id, countInCart } of cart2) {
    if (map.get(id) !== countInCart) return false;
  }

  return true;
};


