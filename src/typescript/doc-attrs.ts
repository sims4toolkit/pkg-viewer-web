export function toggleLightTheme(isLightTheme: boolean) {
  document.documentElement.setAttribute(
    "data-theme",
    isLightTheme ? "light" : "dark"
  );
}
