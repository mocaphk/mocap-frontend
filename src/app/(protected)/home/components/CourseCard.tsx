import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuBookIcon from "@mui/icons-material/MenuBook";

import type { CourseCardProps } from "../types/CourseCardProps";
import ColoredBarCard from "./ColoredBarCard";

export default function CourseCard({
    courseTitle,
    courseShortDescription,
    createdBy,
    barColor,
}: Readonly<CourseCardProps>) {
    return (
        <ColoredBarCard
            sx={{
                width: 230,
                height: 230,
                padding: 2,
                borderRadius: 3,
                borderColor: "lightgray",
                borderWidth: 1,
                flexShrink: 0,
            }}
            barColor={barColor}
        >
            <Box className="flex flex-col w-full mt-1">
                <Typography fontSize="1.1rem" lineHeight="1.3rem">
                    {courseTitle}
                </Typography>
                <Typography color="text.secondary" fontSize="0.8rem">
                    {courseShortDescription}
                </Typography>
            </Box>
            <Box flexGrow={1} />
            <Box className="flex flex-col items-end">
                <Typography
                    color="secondary"
                    marginBottom="0.4rem"
                    fontSize="0.9rem"
                >
                    {createdBy}
                </Typography>
                <Button
                    size="small"
                    color="secondary"
                    variant="contained"
                    startIcon={<MenuBookIcon />}
                    sx={{ fontSize: "0.9rem", textTransform: "none" }}
                >
                    Assignments
                </Button>
            </Box>
        </ColoredBarCard>
    );
}
