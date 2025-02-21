"use strict";

export { isStoragePopulated, getColorTheme, setColorTheme };

const colorThemeKey = "colorTheme";

function isStoragePopulated() {
  return localStorage.getItem(colorThemeKey) !== null;
}

/** Gets the current color theme from saved preferences.
 *
 * Potential return values are "dark" and "light". Returns "dark" if no theme
 * found; safe to call even if storage isn't populated.
 */
function getColorTheme() {
  const theme = localStorage.getItem(colorThemeKey);
  if (theme === null) {
    return "dark";
  }
  return theme;
}

function setColorTheme(theme) {
  localStorage.setItem(colorThemeKey, theme);
}
