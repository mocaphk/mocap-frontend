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
            <Box className="flex flex-col h-full w-full justify-between">
                <Box className="flex flex-col flex-shrink min-h-0 max-w-[173px] w-full mt-1 overflow-hidden">
                    <Typography fontSize="1.1rem" lineHeight="1.3rem">
                        {code} {name} ({year})
                    </Typography>
                    <Typography
                        color="text.secondary"
                        fontSize="0.8rem"
                        textOverflow="ellipsis"
                        sx={{ wordWrap: "break-word" }}
                    >
                        {description}
                    </Typography>
                </Box>
                <Box className="flex flex-col flex-shrink-0 justify-end items-end pt-2">
                    <Typography
                        marginBottom="0.4rem"
                        color="primary"
                        fontSize="0.9rem"
                    >
                        {createdBy}
                    </Typography>
                    <Link href={`course?id=${id}`}>
                        <Button
                            size="small"
                            variant="contained"
                            startIcon={<KeyboardReturnIcon />}
                            sx={{ fontSize: "0.9rem", textTransform: "none" }}
                        >
                            Enter Course
                        </Button>
                    </Link>
                </Box>
            </Box>
        </ColoredBarCard>
    );
}
