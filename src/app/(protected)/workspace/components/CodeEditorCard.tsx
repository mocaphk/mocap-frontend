import Button from "@mui/material/Button";
import { Box, Card, Typography } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PublishIcon from "@mui/icons-material/Publish";
import CodeEditor from "./CodeEditor";
import type { Attempt } from "../types/Attempt";
import type { Question } from "../types/Question";
import React from "react";

export default function CodeEditorCard({
    question,
}: Readonly<{ question: Question }>) {
    const attempt: Attempt = {
        id: null,
        code: 'print("attempt1")',
        userId: "1",
        questionId: "1",
        createdAt: null,
        updatedAt: null,
        isSubmitted: false,
    };

    // code will be used in submit function, just leave it here.
    const [code, setCode] = React.useState(attempt.code);

    const updateCode = (code: React.SetStateAction<string>) => {
        setCode(code);
    };

    return (
        <Card
            className="px-[1.8rem] py-[1.2rem] h-full"
            sx={{ borderRadius: 6 }}
        >
            <Box className="flex h-full flex-col gap-4">
                <Box className="flex-grow">
                    <CodeEditor
                        attempt={attempt}
                        language={question.language}
                        template={question.sampleCode}
                        updateCode={updateCode}
                    />
                </Box>
                <Box className="flex w-full h-fit space-x-6 justify-end">
                    <Button
                        className="w-36"
                        color="secondary"
                        variant="contained"
                    >
                        <PlayCircleOutlineIcon />
                        <Typography className="p-2">Run</Typography>
                    </Button>
                    <Button
                        className="w-36"
                        color="secondary"
                        variant="contained"
                    >
                        <PublishIcon />
                        <Typography className="p-2">Submit</Typography>
                    </Button>
                </Box>
            </Box>
        </Card>
    );
}
