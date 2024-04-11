import * as React from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ColoredBarCard from "./ColoredBarCard";
import type { AssignmentCardProps } from "../types/AssignmentCardProps";
import dayjs from "dayjs";

export default function AssignmentCard({
    id,
    title,
    courseCode,
    dateDue,
    completion,
}: Readonly<AssignmentCardProps>) {
    const dueDate = dayjs(dateDue);
    const dueTime = dueDate.format("h:mm A");

    const assignmentStatusColorMap =
        completion === 100
            ? "lime"
            : dayjs().isAfter(dueDate)
            ? "red"
            : "#ffcc00";

    return (
        <Link href={`assignment?id=${id}`}>
            <ColoredBarCard
                sx={[
                    {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        "&:hover": {
                            backgroundColor: "#f8fafc",
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
                barColor={assignmentStatusColorMap}
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
        </Link>
    );
}
