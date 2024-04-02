import { Box, Button, IconButton, Slider, Typography } from "@mui/material";
import type { Mark } from "@mui/base/useSlider";
import dayjs from "dayjs";
import React from "react";
import HistoryIcon from "@mui/icons-material/History";
import PreviewIcon from "@mui/icons-material/Preview";
import SubmissionModal from "../SubmissionModal";
import type { Attempt } from "../../types/Attempt";
import { v4 as uuidv4 } from "uuid";

function SliderLabel({
    attempt,
    setSelectedAttempt,
}: Readonly<{
    attempt: Attempt;
    setSelectedAttempt: React.Dispatch<React.SetStateAction<Attempt | null>>;
}>) {
    return (
        <Box className="flex gap-1 justify-center items-center">
            <Typography>
                {`Submitted on ${dayjs(attempt.createdAt).format(
                    "DD MMM YYYY, HH:mm:ss"
                )}`}
            </Typography>
            <IconButton onClick={() => setSelectedAttempt(attempt)}>
                <PreviewIcon />
            </IconButton>
        </Box>
    );
}

export default function SubmissionTab({
    language,
}: Readonly<{ language: string }>) {
    const [selectedAttempt, setSelectedAttempt] =
        React.useState<Attempt | null>(null);

    const fakeAttempts: Attempt[] = [
        {
            id: uuidv4(),
            userId: "1",
            questionId: "1",
            code: 'print("Hello 1")',
            createdAt: new Date(),
            updatedAt: new Date(),
            isSubmitted: true,
        },
        {
            id: uuidv4(),
            userId: "1",
            questionId: "1",
            code: 'print("Hello 2")',
            createdAt: new Date(),
            updatedAt: new Date(),
            isSubmitted: true,
        },
        {
            id: uuidv4(),
            userId: "1",
            questionId: "1",
            code: 'print("Hello 3")',
            createdAt: new Date(),
            updatedAt: new Date(),
            isSubmitted: true,
        },
        {
            id: uuidv4(),
            userId: "1",
            questionId: "1",
            code: 'print("Hello 4")',
            createdAt: new Date(),
            updatedAt: new Date(),
            isSubmitted: true,
        },
        {
            id: uuidv4(),
            userId: "1",
            questionId: "1",
            code: 'print("Hello 5")',
            createdAt: new Date(),
            updatedAt: new Date(),
            isSubmitted: true,
        },
    ];

    const marks: Mark[] = fakeAttempts.map((attempt, i) => {
        return {
            value: i,
            label: (
                <SliderLabel
                    attempt={attempt}
                    setSelectedAttempt={setSelectedAttempt}
                />
            ),
        };
    });

    return (
        <Box className="flex h-full w-full justify-between py-2">
            {fakeAttempts.length === 0 ? (
                <Typography
                    variant="h6"
                    className="w-full flex justify-center items-center"
                >
                    You do not have any submission yet
                </Typography>
            ) : (
                <>
                    <Box className="min-h-[200px] h-[200px]">
                        <Slider
                            className="h-full"
                            max={marks.length - 1}
                            min={0}
                            defaultValue={marks.length - 1}
                            orientation="vertical"
                            step={null}
                            marks={marks}
                            track={false}
                        />
                    </Box>
                    <Box className="flex flex-col h-full justify-end">
                        <Button className="h-fit w-36" variant="contained">
                            <HistoryIcon />
                            <Typography className="p-2">Revert</Typography>
                        </Button>
                    </Box>
                    {selectedAttempt && (
                        <SubmissionModal
                            language={language}
                            selectedAttempt={selectedAttempt}
                            setSelectedAttempt={setSelectedAttempt}
                        />
                    )}
                </>
            )}
        </Box>
    );
}
