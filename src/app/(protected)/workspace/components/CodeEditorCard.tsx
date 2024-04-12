import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PublishIcon from "@mui/icons-material/Publish";
import CodeEditor from "./CodeEditor";
import type { Question } from "../types/Question";
import React from "react";
import CardWrapper from "@/app/components/CardWrapper";
import useDebouncedResize from "@/app/utils/resizeHandler";

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
    // force code editor to re-render
    const [codeEditorKey, setCodeEditorKey] = React.useState(0);
    useDebouncedResize(() => setCodeEditorKey((key) => key + 1), 200);

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
        if (codeOnEditor?.trim()) {
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
        if (codeOnEditor?.trim()) {
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
                <Box className="flex-grow rounded-2xl overflow-hidden">
                    <CodeEditor
                        key={codeEditorKey}
                        codeOnEditor={codeOnEditor}
                        language={question.language}
                        updateCode={updateCode}
                        readOnly={false}
                    />
                </Box>
                <Box className="flex flex-row w-full h-fit gap-3 justify-end">
                    <Button
                        sx={{ px: 3 }}
                        color="primary"
                        variant="contained"
                        startIcon={<PlayCircleOutlineIcon />}
                        onClick={handleRunClick}
                    >
                        Run
                    </Button>

                    {!isEditing && !allowEditOrCreate && (
                        <Button
                            sx={{ px: 3 }}
                            color="primary"
                            variant="contained"
                            startIcon={<PublishIcon />}
                            onClick={handleSubmitClick}
                        >
                            Submit
                        </Button>
                    )}
                </Box>
            </Box>
        </CardWrapper>
    );
}
