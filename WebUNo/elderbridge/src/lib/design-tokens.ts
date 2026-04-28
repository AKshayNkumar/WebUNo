export const colors = {
  background: {
    primary:   "#FFFDF5",
    secondary: "#F5F0E8",
    elevated:  "#EDEDDD",
    inverse:   "#1A1A1A",
  },
  text: {
    primary:   "#1A1A1A",
    secondary: "#444444",
    inverse:   "#FFFDF5",
    disabled:  "#767676",
  },
  primary: {
    DEFAULT:  "#1A56DB",
    hover:    "#1446B8",
    active:   "#0F3590",
    light:    "#EBF2FF",
    on:       "#FFFDF5",
  },
  danger: {
    DEFAULT:  "#CC0000",
    hover:    "#AA0000",
    active:   "#880000",
    light:    "#FFF0F0",
    on:       "#FFFDF5",
  },
  success: {
    DEFAULT:  "#1A7340",
    hover:    "#155C33",
    active:   "#0F4426",
    light:    "#EDFBF2",
    on:       "#FFFDF5",
  },
  warning: {
    DEFAULT:  "#8B4000",
    hover:    "#703300",
    active:   "#562600",
    light:    "#FFF8F0",
    on:       "#FFFDF5",
  },
  focus: { ring: "#FF6B00" },
  border: {
    DEFAULT:  "#D0C8B8",
    strong:   "#9E9580",
    inverse:  "#444444",
  },
  accent: {
    health:   "#1A7340",
    finance:  "#1A56DB",
    family:   "#8B4000",
    urgent:   "#CC0000",
    general:  "#555577",
  },
} as const;

export type AccentColor = keyof typeof colors.accent;

export const sizing = {
  touchMin:    72,
  touchPref:   88,
  touchLarge:  96,
  navHeight:   80,
  cardPadding: 32,
  touchGap:    24,
} as const;

export const animation = {
  duration: { instant: 100, gentle: 300, max: 400 },
  easing: {
    gentle: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
    out:    "ease-out",
  },
} as const;
