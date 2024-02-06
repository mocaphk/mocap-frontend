import CodeEditor from "./CodeEditor";
import type { Attempt } from "../types/Attempt";
import { Box, Modal } from "@mui/material";

export default function SubmissionModal({
    language,
    selectedAttempt,
    setSelectedAttempt,
}: Readonly<{
    language: string;
    selectedAttempt: Attempt;
    setSelectedAttempt: React.Dispatch<React.SetStateAction<Attempt | null>>;
}>) {
    return (
        <Modal
            className="flex justify-center items-center h-full w-full p-4"
            open={selectedAttempt != null}
            onClose={() => setSelectedAttempt(null)}
        >
            <Box
                className="bg-background p-4 h-full w-[50%]"
                sx={{ borderRadius: 6 }}
            >
                <CodeEditor
                    updateCode={null}
                    language={language}
                    template="no template is needed"
                    attempt={selectedAttempt}
                    options={{ readOnly: true }}
                />
            </Box>
        </Modal>
    );
}
