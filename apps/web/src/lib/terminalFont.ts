/**
 * Terminal font-family resolution.
 *
 * Resolves the user's `terminalFontFamily` setting into a CSS font-family
 * string suitable for xterm.js. When the user specifies a custom font (e.g. a
 * Nerd Font), it is prepended to the default stack so the system fonts remain
 * as fallbacks.
 */

export const DEFAULT_TERMINAL_FONT_STACK =
  '"SF Mono", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace';

/**
 * Build a CSS `font-family` value from the user setting.
 *
 * - Empty / whitespace-only → default stack unchanged.
 * - Non-empty → quoted user font prepended to the default stack.
 */
export function resolveTerminalFontFamily(userFont: string): string {
  const trimmed = userFont.trim();
  if (!trimmed) return DEFAULT_TERMINAL_FONT_STACK;
  return `"${trimmed}", ${DEFAULT_TERMINAL_FONT_STACK}`;
}
