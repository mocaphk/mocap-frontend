import React from "react";
import Button from "@mui/material/Button";
import { Alert, Box, Snackbar } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PublishIcon from "@mui/icons-material/Publish";
import CodeEditor from "./CodeEditor";
import type { Question } from "../types/Question";
import CardWrapper from "@/app/components/CardWrapper";
import type { SampleTestcase } from "../types/Testcase";
import type { CustomTestcase } from "../types/Testcase";

export default function CodeEditorCard({
    question,
    isEditing,
    allowEditOrCreate,
    updateSampleCode,
    codeOnEditor,
    setCodeOnEditor,
    createOrUpdateAttempt,
    runAttemptFunc,
    runSampleTestcasesFunc,
    submitAttemptFunc,
    sampleTestcases,
    customTestcases,
}: Readonly<{
    question: Question;
    isEditing: boolean;
    allowEditOrCreate: boolean;
    updateSampleCode: Function;
    codeOnEditor: string;
    setCodeOnEditor: Function;
    createOrUpdateAttempt: Function;
    runAttemptFunc: Function;
    runSampleTestcasesFunc: Function;
    submitAttemptFunc: Function;
    sampleTestcases: SampleTestcase[];
    customTestcases: CustomTestcase[];
}>) {
    const [openCodeEmptyError, setOpenCodeEmptyError] =
        React.useState<boolean>(false);

    const updateCode = (code: React.SetStateAction<string>) => {
        setCodeOnEditor(code);
        if (isEditing) {
            updateSampleCode(code);
        }
    };

    const runAttempt = async () => {
        if (isEditing) {
            const inputs = sampleTestcases.map(
                (testcase: SampleTestcase) => testcase.input
            );
            await runSampleTestcasesFunc({
                variables: {
                    questionId: question.id,
                    testcaseInputs: inputs,
                    code: codeOnEditor,
                },
            });
        } else {
            const currentAttemptId = await createOrUpdateAttempt(false);

            const testcases = [...sampleTestcases, ...customTestcases];
            const input = testcases.map((testcase) => testcase.input);
            await runAttemptFunc({
                variables: {
                    attemptId: currentAttemptId ?? "",
                    testcaseInputs: input,
                },
            });
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
            setOpenCodeEmptyError(true);
        }
    };

    const handleSubmitClick = async () => {
        if (codeOnEditor?.trim()) {
            await submitAttempt();
        } else {
            setOpenCodeEmptyError(true);
        }
    };

    return (
        <CardWrapper className="h-full">
            <Box className="flex h-full flex-col gap-4">
                <Box className="flex-1 rounded-2xl overflow-hidden">
                    <CodeEditor
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
            <Snackbar
                open={openCodeEmptyError}
                autoHideDuration={3000}
                onClose={() => setOpenCodeEmptyError(false)}
            >
                <Alert
                    onClose={() => setOpenCodeEmptyError(false)}
                    severity="error"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    An error occurred due to the absence of code.
                </Alert>
            </Snackbar>
        </CardWrapper>
    );
}
