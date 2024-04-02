import React from "react";
import {
    Button,
    Chip,
    IconButton,
    Box,
    Typography,
    TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import type { TestCase } from "../../types/TestCase";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import { v4 as uuidv4 } from "uuid";

export default function TestCaseTab() {
    const fakeTestCases: TestCase[] = [
        {
            id: uuidv4(),
            questionId: "Q1",
            variables: {
                num: 1,
                str: "hello",
            },
            providedByTeacher: true,
        },
        {
            id: uuidv4(),
            questionId: "Q2",
            variables: {
                num: 2,
                str: "world",
            },
            providedByTeacher: false,
        },
    ];

    const [selectedTestCase, setSelectedTestCase] = React.useState<
        TestCase | undefined
    >(fakeTestCases[0]);
    const [testCases, setTestCases] = React.useState(fakeTestCases);

    const handleChipClick = (id: string) => {
        const testCase = testCases.find((testCase) => testCase.id === id);
        setSelectedTestCase(testCase);
    };

    const handleDeleteChip = (id: string) => {
        setTestCases((prev) => {
            return prev.filter((testCase) => testCase.id !== id);
        });
        if (selectedTestCase?.id === id) {
            setSelectedTestCase(testCases[0]);
        }
    };

    const handleAddTestCase = () => {
        const newTestCase: TestCase = {
            id: uuidv4(),
            questionId: "Q1",
            variables: {
                num: null,
                str: null,
            },
            providedByTeacher: false,
        };

        setTestCases((prevTestCases) => [...prevTestCases, newTestCase]);
        setSelectedTestCase(newTestCase);
    };

    const updateTestCaseVariableValue = (
        id: string,
        key: string,
        value: TestCase["variables"][keyof TestCase["variables"]]
    ) => {
        setSelectedTestCase((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                variables: {
                    ...prev.variables,
                    [key]: value,
                },
            };
        });
        setTestCases((prev) => {
            const testCase = prev.find((testCase) => testCase.id === id);
            if (!testCase) return prev;
            testCase.variables[key] = value;
            return prev;
        });
    };

    return (
        <Box className="space-y-4">
            <Box
                className="flex flex-row w-full items-center flex-wrap"
                gap={1}
            >
                {testCases.map((testCase, i) => (
                    <Chip
                        key={testCase.id}
                        id={testCase.id}
                        label={`Test Case ${i + 1}`}
                        color={
                            selectedTestCase?.id === testCase.id
                                ? "primary"
                                : "default"
                        }
                        onClick={() => handleChipClick(testCase.id)}
                        onDelete={
                            !testCase.providedByTeacher
                                ? () => handleDeleteChip(testCase.id)
                                : undefined
                        }
                        deleteIcon={
                            !testCase.providedByTeacher ? (
                                <CloseIcon />
                            ) : undefined
                        }
                    />
                ))}
                <IconButton onClick={handleAddTestCase}>
                    <AddIcon />
                </IconButton>
            </Box>
            <Box className="space-y-2">
                {selectedTestCase &&
                    Object.entries(selectedTestCase.variables).map(
                        ([key, value]) => {
                            return (
                                <Box key={key}>
                                    <Typography fontFamily="consolas">
                                        {key}
                                    </Typography>
                                    <TextField
                                        id={`${selectedTestCase.id}_${key}`}
                                        key={`${selectedTestCase.id}_${key}`}
                                        className="w-full"
                                        type="text"
                                        defaultValue={value}
                                        onBlur={(e) => {
                                            updateTestCaseVariableValue(
                                                selectedTestCase.id,
                                                key,
                                                e.target.value
                                            );
                                        }}
                                        autoComplete="off"
                                    />
                                </Box>
                            );
                        }
                    )}
            </Box>
            <Box className="flex w-full h-fit space-x-6 justify-end">
                <Button className="h-fit w-36" variant="contained">
                    <PlayCircleOutlineIcon />
                    <Typography className="p-2">Run</Typography>
                </Button>
                <Button className="h-fit w-36" variant="contained">
                    <DirectionsRunIcon />
                    <Typography className="p-2">Run All</Typography>
                </Button>
            </Box>
        </Box>
    );
}
