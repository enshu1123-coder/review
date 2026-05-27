import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        action: { DEFAULT: "#0066cc", focus: "#0071e3", ondark: "#2997ff" },
        ink: { DEFAULT: "#1d1d1f", 80: "#333333", 48: "#7a7a7a" },
        canvas: { DEFAULT: "#ffffff", parchment: "#f5f5f7", pearl: "#fafafc" },
        tile: { 1: "#272729", 2: "#2a2a2c", 3: "#252527" },
        hairline: { DEFAULT: "#e0e0e0", soft: "#f0f0f0" },
      },
      fontFamily: {
        display: [
          "SF Pro Display",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Apple SD Gothic Neo",
          "Pretendard",
          "Noto Sans KR",
          "sans-serif",
        ],
        text: [
          "SF Pro Text",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Apple SD Gothic Neo",
          "Pretendard",
          "Noto Sans KR",
          "sans-serif",
        ],
      },
      fontSize: {
        "hero-display": ["56px", { lineHeight: "1.07", letterSpacing: "-0.28px", fontWeight: "600" }],
        "display-lg": ["40px", { lineHeight: "1.10", letterSpacing: "0", fontWeight: "600" }],
        "display-md": ["34px", { lineHeight: "1.47", letterSpacing: "-0.374px", fontWeight: "600" }],
        lead: ["28px", { lineHeight: "1.14", letterSpacing: "0.196px", fontWeight: "400" }],
        tagline: ["21px", { lineHeight: "1.19", letterSpacing: "0.231px", fontWeight: "600" }],
        "body-apple": ["17px", { lineHeight: "1.47", letterSpacing: "-0.374px", fontWeight: "400" }],
        "body-strong": ["17px", { lineHeight: "1.24", letterSpacing: "-0.374px", fontWeight: "600" }],
        caption: ["14px", { lineHeight: "1.43", letterSpacing: "-0.224px", fontWeight: "400" }],
        "caption-strong": ["14px", { lineHeight: "1.29", letterSpacing: "-0.224px", fontWeight: "600" }],
        "fine-print": ["12px", { lineHeight: "1.0", letterSpacing: "-0.12px", fontWeight: "400" }],
      },
      borderRadius: {
        apple: "18px",
        "apple-md": "11px",
        "apple-sm": "8px",
      },
      spacing: {
        section: "80px",
      },
    },
  },
  plugins: [],
} satisfies Config;
