import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type SvgIcon from "@mui/material/SvgIcon";

export default function ComponentWrapper({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon,
    title,
    actionButton,
    children,
}: Readonly<{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon: typeof SvgIcon;
    title: string;
    actionButton?: React.ReactNode;
    children: React.ReactNode;
}>) {
    return (
        <Box className="flex flex-col w-full">
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
