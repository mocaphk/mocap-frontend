import { Box, Button, IconButton, Slider, Typography } from "@mui/material";
import type { Mark } from "@mui/base/useSlider";
import dayjs from "dayjs";
import React from "react";
import HistoryIcon from "@mui/icons-material/History";
import PreviewIcon from "@mui/icons-material/Preview";
import SubmissionModal from "../SubmissionModal";
import type { Attempt } from "../../types/Attempt";
import type { ProgrammingLanguage } from "../../../../../../.cache/__types__";

function SliderLabel({
    attempt,
    setPreview,
}: Readonly<{
    attempt: Attempt;
    setPreview: Function;
}>) {
    return (
        <Box className="flex gap-1 justify-center items-center">
            <Typography>
                Submitted at{" "}
                {dayjs(attempt.updatedAt).format("DD MMM YYYY, HH:mm:ss")}
            </Typography>
            <IconButton onClick={() => setPreview(true)}>
                <PreviewIcon />
            </IconButton>
        </Box>
    );
}

export default function SubmissionTab({
    language,
    attemptsList,
    setCodeOnEditor,
}: Readonly<{
    language: ProgrammingLanguage;
    attemptsList: Attempt[];
    setCodeOnEditor: Function;
}>) {
    const [selectedAttempt, setSelectedAttempt] =
        React.useState<Attempt | null>(
            attemptsList[attemptsList.length - 1] || null
        );

    const [preview, setPreview] = React.useState(false);

    const marks: Mark[] = attemptsList.map((attempt, i) => {
        return {
            value: i,
            label: <SliderLabel attempt={attempt} setPreview={setPreview} />,
        };
    });

    const [sliderValue, setSliderValue] = React.useState(marks.length - 1);
    React.useEffect(() => {
        setSliderValue(attemptsList.length - 1);
    }, [attemptsList]);

    const handleRevert = () => {
        console.log("revert clicked");
        console.log("selected attempt: ", selectedAttempt);
        if (selectedAttempt) {
            console.log("reverting to: ", marks.values);
            setCodeOnEditor(selectedAttempt.code);
        }
    };

    return (
        <Box className="flex h-full w-full justify-between py-2">
            {attemptsList.length === 0 ? (
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
                            value={sliderValue}
                            orientation="vertical"
                            step={null}
                            marks={marks}
                            track={false}
                            onChange={(event, value) => {
                                setSliderValue(value as number);
                                setSelectedAttempt(
                                    attemptsList[value as number]
                                );
                            }}
                        />
                    </Box>
                    <Box className="flex flex-col h-full justify-end">
                        <Button
                            sx={{ px: 3 }}
                            color="primary"
                            variant="contained"
                            startIcon={<HistoryIcon />}
                            onClick={handleRevert}
                        >
                            Revert
                        </Button>
                    </Box>
                    {selectedAttempt && (
                        <SubmissionModal
                            language={language}
                            selectedAttempt={selectedAttempt}
                            preview={preview}
                            setPreview={setPreview}
                        />
                    )}
                </>
            )}
        </Box>
    );
}
