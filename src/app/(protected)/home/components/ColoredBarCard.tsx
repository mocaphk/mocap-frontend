import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardColoredBar from "./CardColoredBar";

import type { SxProps } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

export default function ColoredBarCard({
    sx,
    barColor,
    children,
}: Readonly<{
    sx: SxProps<Theme>;
    barColor: string;
    children: React.ReactNode;
}>) {
    return (
        <Card sx={sx}>
            <Box className="flex flex-row h-full">
                <CardColoredBar barColor={barColor} />
                <Box className="flex flex-col w-full">{children}</Box>
            </Box>
        </Card>
    );
}
