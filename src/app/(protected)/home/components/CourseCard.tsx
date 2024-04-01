import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

import type { CourseCardProps } from "../types/CourseCardProps";
import ColoredBarCard from "./ColoredBarCard";
import Link from "next/link";

export default function CourseCard({
    id,
    code,
    name,
    year,
    description = "",
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
                    {code} {name} ({year})
                </Typography>
                <Typography color="text.secondary" fontSize="0.8rem">
                    {description}
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
                <Link href={`course?id=${id}`}>
                    <Button
                        size="small"
                        color="secondary"
                        variant="contained"
                        startIcon={<KeyboardReturnIcon />}
                        sx={{ fontSize: "0.9rem", textTransform: "none" }}
                    >
                        Enter Course
                    </Button>
                </Link>
            </Box>
        </ColoredBarCard>
    );
}
