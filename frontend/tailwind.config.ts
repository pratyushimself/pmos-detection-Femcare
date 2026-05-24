import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        display: ["'Instrument Serif'", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))", glow: "hsl(var(--primary-glow))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        pearl: "hsl(var(--pearl))",
        blush: "hsl(var(--blush))",
        rose: "hsl(var(--rose))",
        magenta: "hsl(var(--magenta))",
        crimson: "hsl(var(--crimson))",
        lavender: "hsl(var(--lavender))",
        plum: "hsl(var(--plum))",
        risk: { low: "hsl(var(--risk-low))", mod: "hsl(var(--risk-mod))", high: "hsl(var(--risk-high))" },
      },
      backgroundImage: {
        "gradient-aurora": "var(--gradient-aurora)",
        "gradient-mesh": "var(--gradient-mesh)",
        "gradient-primary": "var(--gradient-primary)",
        "gradient-soft": "var(--gradient-soft)",
        "gradient-text": "var(--gradient-text)",
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
        "glow-soft": "var(--shadow-glow-soft)",
        elegant: "var(--shadow-elegant)",
        glass: "var(--shadow-glass)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.3s ease-out",
        "accordion-up": "accordion-up 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
