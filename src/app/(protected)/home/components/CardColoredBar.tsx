"use client";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

function CardColoredBar({ barColor }: Readonly<{ barColor: string }>) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                width: 8,
                marginRight: theme.spacing(2),
                borderRadius: 8,
                backgroundColor: barColor,
            }}
        ></Box>
    );
}

export default CardColoredBar;
