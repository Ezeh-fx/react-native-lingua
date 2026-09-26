export const colors = {
  brand: {
    purple: "#6C4EF5",
    deepPurple: "#5B3BF6",
    blue: "#4D8BFF",
    green: "#21C16B",
  },
  semantic: {
    success: "#21C16B",
    warning: "#FFC800",
    streak: "#FF8A00",
    error: "#FF4D4F",
    info: "#4D8BFF",
  },
  neutrals: {
    textPrimary: "#0D132B",
    textSecondary: "#687280",
    border: "#E5E7EB",
    surface: "#F6F7FB",
    background: "#FFFFFF",
  },
  overlay: {
    light: "rgba(0, 0, 0, 0.4)",
    medium: "rgba(0, 0, 0, 0.6)",
    dark: "rgba(0, 0, 0, 0.8)",
  },
} as const;

export type Colors = typeof colors;
