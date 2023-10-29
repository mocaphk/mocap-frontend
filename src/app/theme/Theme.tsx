"use client";

import type { Theme } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

const theme: Theme = createTheme({
    palette: {
        primary: {
            main: "#ffffff",            // white / gray
            // main: "#f6f6f2",            // white / gray
            light: "#badfe7",           // lighter green
            dark: "#388087",            // dark green
            contrastText: "#a8a8bd",    // gray
        },
        secondary: {
            main: "#388087",            // dark green
            light: "#f6f6f2",           // white / gray
            dark: "#badfe7",            // lighter green
            contrastText: "#a8a8bd",    // gray
        },
    },
});

export default theme;
