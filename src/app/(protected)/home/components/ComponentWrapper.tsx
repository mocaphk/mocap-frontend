import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

export default function ComponentWrapper({
    icon,
    title,
    children,
}: Readonly<{
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}>) {
    return (
        <Card sx={{ padding: 2, borderRadius: 3 }}>
            <Box className="flex flex-col w-full">
                <Box className="flex flex-row h-full">
                    {icon}
                    <Typography>
                        {title}
                    </Typography>
                </Box>
                {children}
            </Box>
        </Card>
    );
}
