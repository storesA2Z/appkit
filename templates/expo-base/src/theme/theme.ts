import layoutData from "../data/layout.json";

function parseNumeric(value: string | number): number {
  if (typeof value === "number") return value;
  return parseInt(value.replace(/[^0-9.]/g, ""), 10) || 0;
}

const rawTheme = layoutData.theme;

export const theme = {
  colors: {
    primary: rawTheme.colors.primary,
    secondary: rawTheme.colors.secondary,
    accent: rawTheme.colors.accent,
    background: rawTheme.colors.background,
    text: rawTheme.colors.text,
    lightGray: "#f5f5f5",
    mediumGray: "#cccccc",
    darkGray: "#666666",
    white: "#ffffff",
    black: "#000000",
    star: "#FFB800",
    error: "#ff4444",
    success: "#00C851",
  },
  typography: {
    fontFamily: rawTheme.typography.fontFamily,
    fontSize: parseNumeric(rawTheme.typography.fontSize),
    fontWeight: rawTheme.typography.fontWeight as
      | "400"
      | "500"
      | "600"
      | "700",
  },
  layout: {
    borderRadius: parseNumeric(rawTheme.layout.borderRadius),
    spacing: parseNumeric(rawTheme.layout.spacing),
  },
};

export type Theme = typeof theme;
export default theme;
