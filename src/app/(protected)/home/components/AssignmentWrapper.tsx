import { Box, Typography } from "@mui/material";
import type { AssignmentWrapperProps } from "../types/AssignmentWrapperProps";
import AssignmentCard from "./AssignmentCard";
import dayjs from "dayjs";

export default function AssignmentWrapper({
    dueDate,
    assignemnts,
}: Readonly<AssignmentWrapperProps>) {
    return (
        <Box className="flex flex-col space-y-2">
            <Box className="flex flex-row space-x-1">
                <Typography fontSize={18}>
                    {dayjs(dueDate).format("ddd")}
                </Typography>
                <Typography color="primary.main" fontSize={18}>
                    {dayjs(dueDate).format("D/M")}
                </Typography>
            </Box>
            <Box className="flex flex-col space-y-2">
                {assignemnts.map((assignment) => (
                    <AssignmentCard key={assignment.title} {...assignment} />
                ))}
            </Box>
        </Box>
    );
}
