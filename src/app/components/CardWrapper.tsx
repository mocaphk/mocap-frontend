import * as React from "react";
import Card from "@mui/material/Card";

export default function CardWrapper({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Card sx={{ padding: "1.2rem 1.8rem", borderRadius: 6 }}>
            {children}
        </Card>
    );
}
