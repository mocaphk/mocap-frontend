import React from "react";
import { Box, IconButton } from "@mui/material";
import type { Question } from "../../types/Question";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import EditIcon from "@mui/icons-material/Edit";
import ComponentWrapper from "@/app/components/ComponentWrapper";

export default function QuestionTab({
    allowEditOrCreate,
    question,
    handleEditClick,
}: Readonly<{
    allowEditOrCreate: boolean;
    question: Question;
    handleEditClick: Function;
}>) {
    return (
        <Box className="mt-1">
            <ComponentWrapper
                title={question.title}
                Icon={LiveHelpIcon}
                actionButton={
                    allowEditOrCreate && (
                        <IconButton onClick={() => handleEditClick()}>
                            <EditIcon />
                        </IconButton>
                    )
                }
            >
                <Box className="break-words">{question.description}</Box>
            </ComponentWrapper>
        </Box>
    );
}
