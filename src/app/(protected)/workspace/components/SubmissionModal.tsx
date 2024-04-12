import CodeEditor from "./CodeEditor";
import type { Attempt } from "../types/Attempt";
import { Box, Modal } from "@mui/material";
import type { ProgrammingLanguage } from "../../../../../.cache/__types__";

export default function SubmissionModal({
    language,
    selectedAttempt,
    preview,
    setPreview,
}: Readonly<{
    language: ProgrammingLanguage;
    selectedAttempt: Attempt;
    preview: boolean;
    setPreview: Function;
}>) {
    return (
        <Modal
            className="flex justify-center items-center h-full w-full p-4"
            open={preview}
            onClose={() => setPreview(false)}
        >
            <Box
                className="bg-background p-4 h-full w-[50%]"
                sx={{ borderRadius: 6 }}
            >
                <CodeEditor
                    updateCode={null}
                    language={language}
                    codeOnEditor={selectedAttempt.code}
                    readOnly={true}
                />
            </Box>
        </Modal>
    );
}
