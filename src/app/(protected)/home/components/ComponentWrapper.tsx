import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import type SvgIcon from "@mui/material/SvgIcon";

export default function ComponentWrapper({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon,
    title,
    children,
}: Readonly<{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon: typeof SvgIcon;
    title: string;
    children: React.ReactNode;
}>) {
    return (
        <Card sx={{ padding: "1.2rem 1.8rem", borderRadius: 6 }}>
            <Box className="flex flex-col w-full">
                <Box className="flex flex-row h-full items-center mb-3" >
                    <Icon sx={{height: "1.5rem", width: "1.5rem"}} color="info"/>
                    <Typography marginLeft={1} fontSize="1.3rem" fontWeight="bold" color="info.main">
                        {title}
                    </Typography>
                </Box>
                {children}
            </Box>
        </Card>
    );
}
