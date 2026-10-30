import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ground: "var(--ground)",
        paper: "var(--paper)",
        ink: {
          DEFAULT: "var(--ink)",
          2: "var(--ink-2)",
        },
        rule: {
          DEFAULT: "var(--rule)",
          strong: "var(--rule-strong)",
        },
        navy: {
          DEFAULT: "var(--navy)",
          deep: "var(--navy-deep)",
        },
        tint: "var(--tint)",
        marker: "var(--marker)",
        danger: {
          DEFAULT: "var(--danger)",
          soft: "var(--danger-soft)",
        },
        "surface-hover": "var(--surface-hover)",
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
      },
      boxShadow: {
        drawer: "var(--shadow-drawer)",
        dialog: "var(--shadow-dialog)",
        card: "var(--shadow-card)",
      },
      transitionDuration: {
        fast: "var(--dur-fast)",
        base: "var(--dur-base)",
      },
      transitionTimingFunction: {
        "out-custom": "var(--ease-out)",
      },
    },
  },
  plugins: [],
};

export default config;
