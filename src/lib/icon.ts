/**
 * Category icon helpers.
 * `icon` may be a glyph string (e.g. "▶") or an uploaded image path
 * (e.g. "/uploads/categories/abc.png").
 */
export function isIconImage(icon: string | null | undefined): boolean {
	if (!icon) return false;
	return icon.startsWith('/uploads/') || icon.startsWith('http://') || icon.startsWith('https://');
}
