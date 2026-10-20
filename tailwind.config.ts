import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        etb: {
          blue: "#0033A0",
          darkBlue: "#002270",
          lightBlue: "#E8F0FE",
          cyan: "#00A3E0",
          cyanHover: "#008ec2",
          grayBg: "#F8FAFC",
          cardBorder: "#E2E8F0",
        },
      },
    },
  },
  plugins: [],
};
export default config;
