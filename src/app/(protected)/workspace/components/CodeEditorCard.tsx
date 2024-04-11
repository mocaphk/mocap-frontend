import Button from "@mui/material/Button";
import { Box, Typography } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PublishIcon from "@mui/icons-material/Publish";
import SaveIcon from "@mui/icons-material/Save";
import CodeEditor from "./CodeEditor";
import type { Question } from "../types/Question";
import React from "react";
import CardWrapper from "@/app/components/CardWrapper";

export default function CodeEditorCard({
    question,
    isEditing,
    allowEditOrCreate,
    updateSampleCode,
    codeOnEditor,
    setCodeOnEditor,
    createOrUpdateAttempt,
    runAttemptFunc,
    submitAttemptFunc,
    runSampleCodeFunc,
}: Readonly<{
    question: Question;
    isEditing: boolean;
    allowEditOrCreate: boolean;
    updateSampleCode: Function;
    codeOnEditor: string;
    setCodeOnEditor: Function;
    createOrUpdateAttempt: Function;
    runAttemptFunc: Function;
    submitAttemptFunc: Function;
    runSampleCodeFunc: Function;
}>) {
    const updateCode = (code: React.SetStateAction<string>) => {
        setCodeOnEditor(code);
        if (isEditing) {
            updateSampleCode(code);
        }
    };

    const runAttempt = async () => {
        if (isEditing) {
            await runSampleCodeFunc({
                variables: {
                    questionId: question.id,
                    code: codeOnEditor,
                },
            });
        } else {
            const currentAttemptId = await createOrUpdateAttempt(false);

            const response = await runAttemptFunc({
                variables: {
                    attemptId: currentAttemptId ?? "",
                },
            });
            console.log(
                "Run attempt result:",
                response.data?.runAttempt.results
            );
        }
    };

    const submitAttempt = async () => {
        const currentAttemptId = await createOrUpdateAttempt(true);

        const response = await submitAttemptFunc({
            variables: {
                attemptId: currentAttemptId ?? "",
            },
        });
        console.log(
            "Submit attempt result:",
            response.data?.submitAttempt.results
        );
    };

    const handleRunClick = async () => {
        if (codeOnEditor.trim()) {
            await runAttempt();
        } else {
            let confirmMSG = confirm(
                "The code is empty, are you sure to run it?"
            );
            if (confirmMSG) {
                await runAttempt();
            } else {
                console.log("cancel run");
            }
        }
    };

    const handleSubmitClick = async () => {
        if (codeOnEditor.trim()) {
            await submitAttempt();
        } else {
            let confirmMSG = confirm(
                "The code is empty, are you sure to submit it?"
            );
            if (confirmMSG) {
                await submitAttempt();
            } else {
                console.log("cancel submit");
            }
        }
    };

    return (
        <CardWrapper className="h-full">
            <Box className="flex h-full flex-col gap-4">
                <Box className="flex-grow">
                    <CodeEditor
                        codeOnEditor={codeOnEditor}
                        language={question.language}
                        updateCode={updateCode}
                        readOnly={false}
                    />
                </Box>
                <Box className="flex w-full h-fit space-x-6 justify-end">
                    <Button
                        className="w-36"
                        color="primary"
                        variant="contained"
                        onClick={handleRunClick}
                    >
                        <PlayCircleOutlineIcon />
                        <Typography className="p-2">Run</Typography>
                    </Button>

                    {!isEditing && !allowEditOrCreate && (
                        <Button
                            className="w-36"
                            color="primary"
                            variant="contained"
                            onClick={handleSubmitClick}
                        >
                            <PublishIcon />
                            <Typography className="p-2">Submit</Typography>
                        </Button>
                    )}
                </Box>
            </Box>
        </CardWrapper>
    );
}
