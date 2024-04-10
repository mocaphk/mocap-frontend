import React from "react";
import { Box, IconButton } from "@mui/material";
import type { Question } from "../../types/Question";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ComponentWrapper from "@/app/components/ComponentWrapper";

export default function QuestionTab({
    question,
    handleDeleteClick,
    handleEditClick,
}: Readonly<{
    question: Question;
    handleDeleteClick: Function;
    handleEditClick: Function;
}>) {
    return (
        <ComponentWrapper
            title={question.title}
            Icon={LiveHelpIcon}
            actionButton={
                <Box className="flex flex-row gap-2">
                    <IconButton
                        color="error"
                        onClick={() => handleDeleteClick()}
                    >
                        <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditClick()}>
                        <EditIcon />
                    </IconButton>
                </Box>
            }
        >
            <Box>{question.description}</Box>
        </ComponentWrapper>
    );
}
