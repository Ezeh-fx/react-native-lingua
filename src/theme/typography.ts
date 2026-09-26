export const typography = {
  fontFamily: {
    poppinsRegular: "Poppins-Regular",
    poppinsMedium: "Poppins-Medium",
    poppinsSemibold: "Poppins-SemiBold",
    poppinsBold: "Poppins-Bold",
  },
  fontSize: {
    h1: 32,
    h2: 24,
    h3: 20,
    h4: 16,
    bodyLarge: 16,
    bodyMedium: 14,
    bodySmall: 13,
    caption: 11,
  },
  fontWeight: {
    poppinsRegular: "400",
    poppinsMedium: "500",
    poppinsSemibold: "600",
    poppinsBold: "700",
  },
  lineHeight: {
    h1: 1.2,
    h2: 1.3,
    h3: 1.3,
    h4: 1.4,
    bodyLarge: 1.6,
    bodyMedium: 1.6,
    bodySmall: 1.6,
    caption: 1.4,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
} as const;

export type Typography = typeof typography;
