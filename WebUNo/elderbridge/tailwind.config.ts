import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "360px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
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
      focus: {
        ring: "#FF6B00",
      },
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
      neutral: {
        0:   "#FFFFFF",
        50:  "#FAFAF7",
        100: "#F0EDE5",
        200: "#E0D9CC",
        300: "#C8BFB0",
        400: "#A89E8E",
        500: "#887E6E",
        600: "#685E50",
        700: "#4E4438",
        800: "#342E24",
        900: "#1A1A1A",
      },
      shadow: {
        DEFAULT: "#2A241A",
      },
      white: "#FFFFFF",
      black: "#000000",
    },
    fontSize: {
      "2xs": ["0.875rem", { lineHeight: "1.8", letterSpacing: "0.02em", fontWeight: "600" }],
      xs:   ["1.125rem", { lineHeight: "1.8", letterSpacing: "0.02em", fontWeight: "600" }],
      sm:   ["1.375rem", { lineHeight: "1.8", letterSpacing: "0.02em", fontWeight: "600" }],
      base: ["1.625rem", { lineHeight: "1.8", letterSpacing: "0.02em", fontWeight: "600" }],
      md:   ["1.75rem",  { lineHeight: "1.8", letterSpacing: "0.02em", fontWeight: "600" }],
      lg:   ["2rem",     { lineHeight: "1.4", letterSpacing: "0.02em", fontWeight: "700" }],
      xl:   ["2.25rem",  { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "700" }],
      "2xl":["2.625rem", { lineHeight: "1.3", letterSpacing: "0em",    fontWeight: "700" }],
      "3xl":["3rem",     { lineHeight: "1.2", letterSpacing: "-0.01em",fontWeight: "700" }],
      "4xl":["3.5rem",   { lineHeight: "1.1", letterSpacing: "-0.02em",fontWeight: "700" }],
    },
    fontFamily: {
      sans: ["Atkinson Hyperlegible", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      mono: ["Atkinson Hyperlegible", "SF Mono", "Cascadia Code", "Consolas", "monospace"],
    },
    fontWeight: {
      normal:   "400",
      medium:   "500",
      semibold: "600",
      bold:     "700",
    },
    spacing: {
      px: "1px", 0: "0px", 1: "4px", 2: "8px", 3: "12px",
      4: "16px", 5: "20px", 6: "24px", 7: "28px", 8: "32px",
      9: "36px", 10: "40px", 11: "44px", 12: "48px", 14: "56px",
      16: "64px", 18: "72px", 20: "80px", 22: "88px", 24: "96px",
      28: "112px", 32: "128px", 36: "144px", 40: "160px",
      48: "192px", 56: "224px", 64: "256px", 72: "288px",
      80: "320px", 96: "384px",
    },
    borderRadius: {
      none: "0", sm: "6px", DEFAULT: "12px", md: "12px",
      lg: "16px", xl: "20px", "2xl": "24px", "3xl": "32px", full: "9999px",
    },
    boxShadow: {
      none:   "none",
      sm:     "0 1px 3px 0 rgba(42,36,26,0.12), 0 1px 2px -1px rgba(42,36,26,0.08)",
      DEFAULT:"0 2px 8px -1px rgba(42,36,26,0.14), 0 2px 4px -2px rgba(42,36,26,0.10)",
      md:     "0 4px 16px -2px rgba(42,36,26,0.16), 0 2px 8px -2px rgba(42,36,26,0.10)",
      lg:     "0 8px 24px -4px rgba(42,36,26,0.18), 0 4px 12px -4px rgba(42,36,26,0.12)",
      xl:     "0 12px 40px -8px rgba(42,36,26,0.22), 0 6px 16px -6px rgba(42,36,26,0.14)",
      focus:  "0 0 0 4px #FF6B00",
      inner:  "inset 0 2px 4px 0 rgba(42,36,26,0.10)",
    },
    transitionDuration: {
      75: "75ms", 100: "100ms", 150: "150ms",
      200: "200ms", 300: "300ms", 400: "400ms",
    },
    transitionTimingFunction: {
      DEFAULT: "ease-out",
      in:      "ease-in",
      out:     "ease-out",
      "in-out":"ease-in-out",
      gentle:  "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
    },
    animation: {
      none:         "none",
      pulse:        "pulse 3s ease-in-out infinite",
      "fade-in":    "fadeIn 400ms ease-out",
      "bounce-once":"bounceOnce 600ms ease-out",
      "wave-1":     "wave 1.2s ease-in-out 0ms infinite",
      "wave-2":     "wave 1.2s ease-in-out 150ms infinite",
      "wave-3":     "wave 1.2s ease-in-out 300ms infinite",
      ping:         "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
      spin:         "spin 1s linear infinite",
    },
    minHeight: {
      0:  "0px",
      "touch-min":   "72px",
      "touch-pref":  "88px",
      "touch-large": "96px",
      "nav":         "80px",
      screen: "100vh",
    },
    minWidth: {
      0:  "0px",
      "touch-min":   "72px",
      "touch-pref":  "88px",
      "touch-large": "96px",
      full: "100%",
    },
    extend: {
      ringWidth: { 0: "0px", 2: "2px", DEFAULT: "4px", 4: "4px", 8: "8px" },
      ringColor: { DEFAULT: "#FF6B00" },
      ringOffsetWidth: { DEFAULT: "2px", 0: "0px", 2: "2px", 4: "4px" },
      keyframes: {
        fadeIn:     { from: { opacity: "0" }, to: { opacity: "1" } },
        pulse:      { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.7" } },
        bounceOnce: {
          "0%":   { transform: "translateY(0)" },
          "30%":  { transform: "translateY(-8px)" },
          "60%":  { transform: "translateY(-3px)" },
          "80%":  { transform: "translateY(-5px)" },
          "100%": { transform: "translateY(0)" },
        },
        wave: {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%":      { transform: "scaleY(1.0)" },
        },
        ping: {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities }: any) {
      addUtilities({
        ".touch-zone": {
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            top: "-16px", right: "-16px", bottom: "-16px", left: "-16px",
          },
        },
        ".text-crisp": {
          "-webkit-font-smoothing":  "antialiased",
          "-moz-osx-font-smoothing": "grayscale",
          "text-rendering":          "optimizeLegibility",
        },
        ".gpu": {
          transform: "translateZ(0)",
          "will-change": "transform",
          "backface-visibility": "hidden",
        },
        ".respects-system-font": { "font-size": "max(26px, 1.625rem)" },
        ".pb-safe": { paddingBottom: "env(safe-area-inset-bottom, 0px)" },
      });
    },
  ],
};

export default config;
