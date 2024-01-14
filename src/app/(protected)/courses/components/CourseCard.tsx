import * as React from "react";
import { Box, Button, Card, Typography } from "@mui/material";

import type { CourseCardProps } from "../types/CourseCardProps";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import Link from "next/link";

export default function CourseCard({
    year,
    courseCode,
    courseTitle,
    courseShortDescription,
    createdBy,
}: Readonly<CourseCardProps>) {
    return (
        <Card
            sx={{
                padding: 2,
                borderRadius: 3,
                borderColor: "lightgray",
                borderWidth: 1,
            }}
        >
            <Box className="flex flex-col w-full mt-1">
                <Typography fontSize="1.2rem" lineHeight="1.3rem">
                    {courseTitle}
                </Typography>
                <Typography
                    color="text.secondary"
                    fontSize="1rem"
                    lineHeight="2rem"
                >
                    {courseShortDescription}
                </Typography>
            </Box>
            <Box className="flex flex-col items-end">
                <Typography
                    color="secondary"
                    marginBottom="0.4rem"
                    fontSize="1rem"
                >
                    {createdBy}
                </Typography>
                <Link href={`courses?courseCode=${courseCode}&year=${year}`}>
                    <Button
                        size="small"
                        color="secondary"
                        variant="contained"
                        startIcon={<KeyboardReturnIcon />}
                        sx={{ fontSize: "1rem", textTransform: "none" }}
                    >
                        Enter Course
                    </Button>
                </Link>
            </Box>
        </Card>
    );
}
