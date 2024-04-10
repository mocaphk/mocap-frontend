import React from "react";
import ComponentWrapper from "@/app/components/ComponentWrapper";
import LinkButton from "@/app/components/LinkButton";
import { Box, Button, Dialog, DialogTitle, Grid } from "@mui/material";
import { QuestionStatus } from "../types/QuestionProps";

import QuizIcon from "@mui/icons-material/Quiz";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import DoneIcon from "@mui/icons-material/Done";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import AddIcon from "@mui/icons-material/Add";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import type { GetAssignmentQuery } from "@/app/graphql/course/assignment.graphql";
import NoResultAlert from "@/app/errors/noResultAlert";

export default function QuestionList({
    questions,
}: Readonly<{
    questions: NonNullable<GetAssignmentQuery["assignment"]>["questions"];
}>) {
    const [open, setOpen] = React.useState(false);

    const questionStatusIconMap = {
        [QuestionStatus.Submitted]: {
            icon: DoneIcon,
            color: "lime",
        },
        [QuestionStatus.Ongoing]: {
            icon: TripOriginIcon,
            color: "#ffcc00",
        },
    };

    return (
        <ComponentWrapper
            Icon={QuizIcon}
            title="Questions"
            actionButton={
                <Button
                    variant="outlined"
                    sx={{
                        borderRadius: 5,
                        textTransform: "none",
                        fontSize: 16,
                    }}
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                >
                    Add Question
                </Button>
            }
        >
            {questions.length === 0 ? (
                <NoResultAlert />
            ) : (
                <Box className="flex flex-col gap-3">
                    {questions.map((question) => {
                        const isSubmitted = question.attempts.some(
                            (attempt) => attempt.isSubmitted
                        );
                        const status: QuestionStatus = isSubmitted
                            ? QuestionStatus.Submitted
                            : QuestionStatus.Ongoing;
                        return (
                            <LinkButton
                                key={question.id}
                                Icon={LiveHelpIcon}
                                title={question.title}
                                description={question.description}
                                statusIcon={questionStatusIconMap[status]}
                                link={`/workspace?questionId=${question.id}`}
                            />
                        );
                    })}
                </Box>
            )}

            <Dialog
                onClose={() => setOpen(false)}
                open={open}
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle color="info.main">Add Question</DialogTitle>

                <Box className="w-full flex flex-col px-4 my-2">
                    <Grid container className="w-full my-2" spacing={2}>
                        <Grid item xs={12}>
                            {/* Create a new empty question, then link to workspace page in edit mode */}
                            <LinkButton
                                Icon={PostAddIcon}
                                title="New question"
                                description=""
                                link="workspace/edit?questionId="
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {/* Maybe just link to question bank and add a option in question bank to link the question to assignment */}
                            <LinkButton
                                Icon={AccountBalanceIcon}
                                title="Choose from question bank"
                                description=""
                                link="questionBank"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>
        </ComponentWrapper>
    );
}
