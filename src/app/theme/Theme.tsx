"use client";

import type { Theme } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

const theme: Theme = createTheme({
    palette: {
        primary: {
            main: "#ffffff",            // white
            // main: "#f6f6f2",         // white / gray
            light: "#badfe7",           // lighter green
            dark: "#388087",            // dark green
            contrastText: "#a8a8bd",    // gray
        },
        secondary: {
            main: "#388087",            // dark green
            light: "#badfe7",           // lighter green
            dark: "#6fb3b8",            // lighter dark green
            contrastText: "#ffffff",    // white
        },
        info: {
            main: "#666680",    // gray
        },
    },
});

export default theme;
