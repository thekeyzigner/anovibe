export const THEMES = {
  lime: { name: "Lime", bg: "#0B1F3B", fg: "#FFF9ED", accent: "#C6FF3B", on: "#0B1F3B" },
  cream: { name: "Cream", bg: "#FFF9ED", fg: "#0B1F3B", accent: "#0B1F3B", on: "#FFF9ED" },
  sunset: { name: "Sunset", bg: "linear-gradient(160deg,#FF6B4A,#0B1F3B)", fg: "#FFF9ED", accent: "#C6FF3B", on: "#0B1F3B" },
  ocean: { name: "Ocean", bg: "linear-gradient(160deg,#1E5AA8,#0B1F3B)", fg: "#FFF9ED", accent: "#FFF9ED", on: "#0B1F3B" },
  forest: { name: "Forest", bg: "linear-gradient(160deg,#1F5A3A,#0B1F3B)", fg: "#FFF9ED", accent: "#C6FF3B", on: "#0B1F3B" },
} as const;
export type ThemeId = keyof typeof THEMES;
export const themeOf = (id: string) => THEMES[(id in THEMES ? id : "lime") as ThemeId];
