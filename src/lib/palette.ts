/**
 * 颜色工具：从配置的 4 色调色板派生暗场底色、亮场文字色等。
 * 只处理 #RRGGBB。
 */

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`Invalid hex color: ${hex}`);
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** 向黑色靠拢。amount 0..1 */
export function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

/** 向白色靠拢。amount 0..1 */
export function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

/** css color-mix 写法的 rgba（底盘 visual-theme.tsx 的 rgba 工具同款） */
export function rgba(color: string, alpha: number): string {
  return `color-mix(in srgb, ${color} ${Math.max(0, Math.min(1, alpha)) * 100}%, transparent)`;
}

/** 感知亮度 0..1（YIQ） */
export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 / 255;
}

/**
 * 暗场底色：把配置底色压暗。spotlight-sweep / dark-flip / outline-word-fill 用。
 */
export function stageBg(palette: { bg: string }): string {
  return darken(palette.bg, 0.86);
}

/** 暗场上的亮文字：底色越浅提亮越多 */
export function lightInk(palette: { bg: string }): string {
  return lighten(palette.bg, 0.92);
}
