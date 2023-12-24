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
    },
    plugins: [],
};
export default config;
