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
            <button className="flex flex-row rounded-xl mx-1 hover:bg-[#f1f5f9] active:bg-[#e2e8f0] focus:outline-none focus:ring">
                <ColoredBarCard
                    sx={{
                        width: 350,
                        height: 60,
                        padding: 1,
                        borderRadius: 3,
                        borderColor: "lightgray",
                        borderWidth: 1,
                        backgroundColor: "transparent",
                    }}
                    barColor={assignmentStatusColorMap}
                >
                    <Box className="flex flex-col w-[90%] items-start overflow-hidden">
                        <Typography
                            fontSize={16}
                            lineHeight="1.3rem"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                        >
                            {title}
                        </Typography>
                        <Typography color="text.primary" fontSize={12}>
                            {courseCode} · {dueTime}
                        </Typography>
                    </Box>
                </ColoredBarCard>
            </button>
        </Link>
    );
}
