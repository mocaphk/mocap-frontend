import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ColoredBarCard from "./ColoredBarCard";
import type { AssignmentCardProps } from "../types/AssignmentCardProps";

export default function AssignmentCard({
    title,
    courseCode,
    dueTime,
    barColor,
}: Readonly<AssignmentCardProps>) {
    return (
        <ColoredBarCard
            sx={[
                {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    "&:hover": {
                        backgroundColor: "lightgray",
                    },
                },
                {
                    width: 350,
                    height: 60,
                    padding: 1,
                    borderRadius: 3,
                    borderColor: "lightgray",
                    borderWidth: 1,
                },
            ]}
            barColor={barColor}
        >
            <Box className="flex flex-col w-full">
                <Typography fontSize={16} lineHeight="1.3rem">
                    {title}
                </Typography>
                <Typography color="text.primary" fontSize={12}>
                    {courseCode} · {dueTime}
                </Typography>
            </Box>
        </ColoredBarCard>
    );
}
