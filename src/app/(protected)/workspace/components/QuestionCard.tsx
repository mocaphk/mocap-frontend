import React from "react";
import type { Question } from "../types/Question";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

export default function QuestionCard({
    question,
}: Readonly<{ question: Question }>) {
    return (
        <Card
            className="px-[1.8rem] py-[1.2rem] h-full"
            sx={{ borderRadius: 6 }}
        >
            <Box className="overflow-auto h-full">
                <Typography noWrap={true} variant="h4" fontWeight="medium">
                    {question.title}
                </Typography>
                <Typography
                    color="primary"
                    noWrap={true}
                    variant="body1"
                    fontWeight="medium"
                >
                    {question.assignmentId}
                </Typography>
                <Box>{question.description}</Box>
            </Box>
        </Card>
    );
}
