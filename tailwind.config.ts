/* eslint-disable @typescript-eslint/naming-convention */
import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        fontFamily: {
            display: ["Inter", "system-ui", "sans-serif"],
            sans: ["Inter", "system-ui", "sans-serif"],
        },
        colors: {
            primary: "#388087",
            secondary: "#badfe7",
            tertiary: "#6fb3b8",
            background: "#f1f1f4",
        },
        screens: {
            // Follow mui breakpoints
            xs: "0px",
            sm: "600px",
            md: "900px",
            lg: "1200px",
            xl: "1536px",
        },
    },
    plugins: [],
};
export default config;
