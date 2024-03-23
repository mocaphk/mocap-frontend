import * as React from "react";
import Card from "@mui/material/Card";

export default function CardWrapper(
    props: Readonly<React.ComponentProps<typeof Card>>
) {
    return (
        <Card
            {...props}
            sx={{ padding: "1.2rem 1.8rem", borderRadius: 6, ...props?.sx }}
        >
            {props.children}
        </Card>
    );
}
