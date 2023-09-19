import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          from: { transform: "translateX(calc(100% + 16px))" },
          to: { transform: "translateX(0)" },
        },
        swipeOut: {
          from: { transform: "translateX(var(--radix-toast-swipe-end-x))" },
          to: { transform: "translateX(calc(100% + 16px))" },
        },
        hide: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
      },
      animation: {
        toastOpen: "slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        toastClosed: "hide 100ms ease-in",
        toastEnd: "swipeOut 100ms ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
