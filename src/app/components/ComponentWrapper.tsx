import * as React from "react";
import { Box, Typography } from "@mui/material";
import type SvgIcon from "@mui/material/SvgIcon";

export default function ComponentWrapper({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon,
    title,
    actionButton,
    fullHeight = false,
    children,
}: Readonly<{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon: typeof SvgIcon;
    title: string;
    actionButton?: React.ReactNode;
    fullHeight?: boolean;
    children: React.ReactNode;
}>) {
    return (
        <Box className={`flex flex-col w-full ${fullHeight ? "h-full" : ""}`}>
            <Box className="flex flex-row w-full items-center justify-between mb-3">
                <Box className="flex flex-row h-full items-center">
                    <Icon
                        sx={{ height: "1.5rem", width: "1.5rem" }}
                        color="info"
                    />
                    <Typography
                        marginLeft={1}
                        fontSize="1.3rem"
                        fontWeight="medium"
                        color="info.main"
                    >
                        {title}
                    </Typography>
                </Box>
                {actionButton}
            </Box>
            {children}
        </Box>
    );
}
