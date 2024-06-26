import React from "react";
import {
    Button,
    Chip,
    IconButton,
    Box,
    TextField,
    InputLabel,
    Tooltip,
    Checkbox,
    FormControlLabel,
    Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import type {
    CustomTestcase,
    SampleTestcase,
    TestcaseInputEntry,
} from "../../types/Testcase";
import { v4 as uuidv4 } from "uuid";
import ReactDiffViewer from "react-diff-viewer-continued";

export default function TestcaseTab({
    isEditing,
    sampleTestcases,
    customTestcases,
    selectedTestcase,
    setSampleTestcases,
    setCustomTestcases,
    setSelectedTestcase,
    deleteCustomTestcaseFunc,
    createCustomTestcasesFunc,
    updateCustomTestcaseFunc,
    runTestcaseFunc,
    createOrUpdateAttempt,
    questionId,
    codeOnEditor,
    runTestcaseWithSampleCodeFunc,
    setOpenCodeEmptyError,
}: Readonly<{
    isEditing: boolean;
    sampleTestcases: SampleTestcase[];
    customTestcases: CustomTestcase[];
    selectedTestcase: SampleTestcase | CustomTestcase | undefined;
    setSampleTestcases: Function;
    setCustomTestcases: Function;
    setSelectedTestcase: Function;
    deleteCustomTestcaseFunc: Function;
    createCustomTestcasesFunc: Function;
    updateCustomTestcaseFunc: Function;
    runTestcaseFunc: Function;
    createOrUpdateAttempt: Function;
    questionId: string;
    codeOnEditor: string;
    runTestcaseWithSampleCodeFunc: Function;
    setOpenCodeEmptyError: React.Dispatch<React.SetStateAction<boolean>>;
}>) {
    const handleSampleChipClick = (tempId: string) => {
        const testcase = sampleTestcases.find(
            (testcase) => testcase.tempId === tempId
        );
        setSelectedTestcase(testcase);
    };

    // handle delete for normal testcases
    const handleDeleteSampleChip = (id: string, tempId: string) => {
        setSampleTestcases((prev: any[]) => {
            const updatedSampleTestcases = prev.filter(
                (testcase: { tempId: string }) => testcase.tempId !== tempId
            );
            if (selectedTestcase?.tempId === tempId) {
                setSelectedTestcase(updatedSampleTestcases[0] ?? undefined);
            }
            return updatedSampleTestcases;
        });
    };

    const handleCustomChipClick = (tempId: string) => {
        const testcase = customTestcases.find(
            (testcase) => testcase.tempId === tempId
        );
        setSelectedTestcase(testcase);
    };

    const handleDeleteCustomChip = (id: string, tempId: string) => {
        setCustomTestcases((prev: any[]) => {
            const updatedCustomTestcases = prev.filter(
                (testcase: { tempId: string }) => testcase.tempId !== tempId
            );
            if (selectedTestcase?.tempId === tempId) {
                const testcases = [
                    ...sampleTestcases,
                    ...updatedCustomTestcases,
                ];
                setSelectedTestcase(testcases[0] ?? undefined);
            }
            return updatedCustomTestcases;
        });
        if (id !== "" && id !== undefined) {
            deleteCustomTestcaseFunc({ variables: { testcaseId: id } });
        }
    };

    // create sample testcase
    const handleAddTestcase = () => {
        const newTestcase: SampleTestcase = {
            tempId: uuidv4(),
            id: "",
            input: [
                {
                    name: "",
                    value: "",
                },
            ],
            expectedOutput: "",
            isHidden: false,
            output: "",
            isTimeout: false,
        };

        setSampleTestcases((prevTestcases: any) => [
            ...prevTestcases,
            newTestcase,
        ]);
        setSelectedTestcase(newTestcase);
    };

    // Add custom testcase
    const handleAddCustomTestcase = () => {
        const newTestcase: CustomTestcase = {
            tempId: uuidv4(),
            id: "",
            input: [
                {
                    name: "",
                    value: "",
                },
            ],
            expectedOutput: "",
            output: "",
            isTimeout: false,
        };

        setCustomTestcases((prevTestcases: any) => [
            ...prevTestcases,
            newTestcase,
        ]);
        setSelectedTestcase(newTestcase);
    };

    const handleAddArgument = (tempId: string) => {
        const setState = isSelectedCustomTestcase
            ? setCustomTestcases
            : setSampleTestcases;
        setState((prev: any[]) => {
            return prev.map((testcase) => {
                if (testcase.tempId === tempId) {
                    const newTestcase = { ...testcase };
                    newTestcase.input = [
                        ...testcase.input,
                        { name: "", value: "" },
                    ];

                    setSelectedTestcase(newTestcase);
                    return newTestcase;
                }
                return testcase;
            });
        });
    };

    const handleRemoveArgument = (tempId: string, index: number) => {
        const setState = isSelectedCustomTestcase
            ? setCustomTestcases
            : setSampleTestcases;
        setState((prev: any[]) => {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const filterInput = (_: any, i: number) => i !== index;

            return prev.map((testcase) => {
                if (testcase.tempId === tempId) {
                    const newTestcase = { ...testcase };
                    newTestcase.input = testcase.input.filter(filterInput);
                    setSelectedTestcase(newTestcase);
                    return newTestcase;
                }
                return testcase;
            });
        });
    };

    const handleSaveClick = async () => {
        if (selectedTestcase?.id === "") {
            await createCustomTestcasesFunc();
        } else {
            await updateCustomTestcaseFunc();
        }
    };

    // eslint-disable-next-line unused-imports/no-unused-vars

    const handleRunClick = async () => {
        let expectedOutput = selectedTestcase?.expectedOutput;
        let output = selectedTestcase?.output;
        let isTimeout = selectedTestcase?.isTimeout;

        if (!codeOnEditor) {
            setOpenCodeEmptyError(true);
            return;
        }

        if (isEditing) {
            const testcaseInput = selectedTestcase?.input;
            const runRes = await runTestcaseWithSampleCodeFunc({
                variables: {
                    questionId: questionId,
                    testcaseInput: testcaseInput,
                    code: codeOnEditor,
                },
            });
            expectedOutput = runRes.data?.runTestcaseWithCode.sampleOutput
                .map((output: { payload: any }) => output.payload)
                .join("");

            output = runRes.data?.runTestcaseWithCode.output
                .map((output: { payload: any }) => output.payload)
                .join("");
            isTimeout = runRes.data?.runTestcaseWithCode.isExceedTimeLimit;
        } else {
            const createOrUpdateAttemptId = await createOrUpdateAttempt(false);

            const runRes = await runTestcaseFunc({
                variables: {
                    attemptId: createOrUpdateAttemptId,
                    testcaseInput: selectedTestcase?.input,
                },
            });

            expectedOutput = runRes.data?.runTestcase.sampleOutput
                .map((output: { payload: any }) => output.payload)
                .join("");

            output = runRes.data?.runTestcase.output
                .map((output: { payload: any }) => output.payload)
                .join("");

            isTimeout = runRes.data?.runTestcase.isExceedTimeLimit;
        }

        const setState = isSelectedCustomTestcase
            ? setCustomTestcases
            : setSampleTestcases;
        setState((prev: any[]) => {
            return prev.map((testcase) => {
                if (testcase.tempId === selectedTestcase?.tempId) {
                    const newTestcase = { ...testcase };
                    let newTestcaseCopy = JSON.parse(
                        JSON.stringify(newTestcase)
                    );

                    newTestcaseCopy.expectedOutput = expectedOutput;
                    newTestcaseCopy.output = output;
                    newTestcaseCopy.isTimeout = isTimeout;
                    setSelectedTestcase(newTestcaseCopy);
                    return newTestcaseCopy;
                }
                return testcase;
            });
        });
    };

    const updateTestcaseInput = (
        tempId: string,
        index: number,
        key: keyof TestcaseInputEntry,
        value: string
    ) => {
        const setState = isSelectedCustomTestcase
            ? setCustomTestcases
            : setSampleTestcases;
        setState((prev: any[]) => {
            return prev.map((testcase) => {
                if (testcase.tempId === tempId) {
                    const newTestcase = { ...testcase };
                    let newTestcaseCopy = JSON.parse(
                        JSON.stringify(newTestcase)
                    );
                    newTestcaseCopy.input[index][key] = value;
                    if (selectedTestcase && "isHidden" in selectedTestcase) {
                        newTestcaseCopy.isHidden = selectedTestcase.isHidden;
                    }

                    setSelectedTestcase(newTestcaseCopy);
                    return newTestcaseCopy;
                }
                return testcase;
            });
        });
    };

    const isSelectedSampleTestcase =
        selectedTestcase &&
        sampleTestcases.find(
            (testcase: { tempId: string }) =>
                testcase.tempId === selectedTestcase.tempId
        ) !== undefined;
    const isSelectedCustomTestcase =
        selectedTestcase && !isSelectedSampleTestcase;
    const showAddOrDeleteArgumentButton =
        (isEditing && isSelectedSampleTestcase) ||
        (!isEditing && isSelectedCustomTestcase);

    return (
        <Box className="space-y-4">
            <Box
                className="flex flex-row w-full items-center flex-wrap"
                gap={1}
            >
                {isEditing
                    ? sampleTestcases.map(
                          (
                              testcase: { tempId: string; id: any },
                              i: number
                          ) => (
                              <Chip
                                  key={testcase.tempId}
                                  id={testcase.tempId}
                                  label={
                                      <Box className="flex flex-row items-center gap-2">
                                          <p>Test Case {i + 1}</p>
                                          {(testcase as SampleTestcase)
                                              .isHidden && (
                                              <Tooltip title="Hidden">
                                                  <VisibilityOffIcon
                                                      sx={{
                                                          width: 18,
                                                          height: 18,
                                                      }}
                                                  />
                                              </Tooltip>
                                          )}
                                      </Box>
                                  }
                                  color={
                                      selectedTestcase?.tempId ===
                                      testcase.tempId
                                          ? "primary"
                                          : "default"
                                  }
                                  onClick={() =>
                                      handleSampleChipClick(testcase.tempId)
                                  }
                                  onDelete={() =>
                                      handleDeleteSampleChip(
                                          testcase.id,
                                          testcase.tempId
                                      )
                                  }
                                  deleteIcon={<CloseIcon />}
                              />
                          )
                      )
                    : [...sampleTestcases, ...customTestcases].map(
                          (testcase, i) => (
                              <Chip
                                  key={testcase.tempId}
                                  id={testcase.tempId}
                                  label={
                                      <Box className="flex flex-row items-center gap-2">
                                          <p>Test Case {i + 1}</p>
                                          {(testcase as SampleTestcase)
                                              .isHidden && (
                                              <Tooltip title="Hidden">
                                                  <VisibilityOffIcon
                                                      sx={{
                                                          width: 18,
                                                          height: 18,
                                                      }}
                                                  />
                                              </Tooltip>
                                          )}
                                      </Box>
                                  }
                                  color={
                                      selectedTestcase?.tempId ===
                                      testcase.tempId
                                          ? "primary"
                                          : "default"
                                  }
                                  onClick={() => {
                                      if (
                                          sampleTestcases.find(
                                              (normalTestcase: { id: any }) =>
                                                  normalTestcase.id ===
                                                  testcase.id
                                          )
                                      ) {
                                          handleSampleChipClick(
                                              testcase.tempId
                                          );
                                      } else {
                                          handleCustomChipClick(
                                              testcase.tempId
                                          );
                                      }
                                  }}
                                  onDelete={
                                      customTestcases.find(
                                          (customTestcase) =>
                                              customTestcase.id === testcase.id
                                      )
                                          ? () =>
                                                handleDeleteCustomChip(
                                                    testcase.id,
                                                    testcase.tempId
                                                )
                                          : undefined
                                  }
                                  deleteIcon={
                                      customTestcases.find(
                                          (customTestcase) =>
                                              customTestcase.id === testcase.id
                                      ) ? (
                                          <CloseIcon />
                                      ) : undefined
                                  }
                              />
                          )
                      )}
                <IconButton
                    color="primary"
                    onClick={
                        isEditing ? handleAddTestcase : handleAddCustomTestcase
                    }
                >
                    <AddIcon />
                </IconButton>
            </Box>

            {selectedTestcase && (
                <Box className="flex flex-col gap-2">
                    <Box className="flex flex-col gap-3">
                        <Box className="flex flex-row items-center justify-between -my-2">
                            <Box className="flex flex-row items-center gap-1">
                                <InputLabel>Arguments:</InputLabel>
                                <Tooltip title="Input arguments will be passed to the program as standard input (stdin) in order.">
                                    <HelpOutlineIcon
                                        color="info"
                                        sx={{ width: 18, height: 18 }}
                                    />
                                </Tooltip>
                            </Box>
                            <Box className="flex flex-row h-fit gap-2 justify-end items-center">
                                {isSelectedCustomTestcase && (
                                    <IconButton
                                        color="success"
                                        onClick={handleSaveClick}
                                    >
                                        <SaveIcon />
                                    </IconButton>
                                )}
                                <IconButton
                                    color="primary"
                                    onClick={() => handleRunClick()}
                                >
                                    <PlayCircleOutlineIcon />
                                </IconButton>
                            </Box>
                        </Box>
                        {selectedTestcase?.input.map((input, index) => {
                            return (
                                <Box
                                    key={index}
                                    className="flex flex-row w-full gap-3 items-center"
                                >
                                    <TextField
                                        id={`${selectedTestcase.id}_${index}_name`}
                                        className="w-full"
                                        color="primary"
                                        type="text"
                                        label="Name"
                                        value={input.name}
                                        InputProps={{
                                            readOnly:
                                                !isEditing &&
                                                isSelectedSampleTestcase,
                                        }}
                                        onChange={(e) => {
                                            updateTestcaseInput(
                                                selectedTestcase.tempId,
                                                index,
                                                "name",
                                                e.target.value
                                            );
                                        }}
                                        autoComplete="off"
                                    />
                                    <TextField
                                        id={`${selectedTestcase.id}_${index}_value`}
                                        className="w-full"
                                        color="primary"
                                        type="text"
                                        label="Value"
                                        value={input.value}
                                        InputProps={{
                                            readOnly:
                                                !isEditing &&
                                                isSelectedSampleTestcase,
                                        }}
                                        onChange={(e) => {
                                            updateTestcaseInput(
                                                selectedTestcase.tempId,
                                                index,
                                                "value",
                                                e.target.value
                                            );
                                        }}
                                        autoComplete="off"
                                    />
                                    {showAddOrDeleteArgumentButton && (
                                        <IconButton
                                            color="error"
                                            onClick={() =>
                                                handleRemoveArgument(
                                                    selectedTestcase.tempId,
                                                    index
                                                )
                                            }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            );
                        })}
                    </Box>

                    {/* button to add argument */}
                    <Box className="flex justify-center items-center">
                        {showAddOrDeleteArgumentButton && (
                            <Button
                                className="h-fit"
                                color="primary"
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() =>
                                    handleAddArgument(selectedTestcase.tempId)
                                }
                            >
                                New argument
                            </Button>
                        )}
                    </Box>
                    {isEditing && (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={
                                        (selectedTestcase as SampleTestcase)
                                            ?.isHidden ?? false
                                    }
                                    onChange={(e) => {
                                        const newTestcase = {
                                            ...(selectedTestcase as SampleTestcase),
                                        };
                                        newTestcase.isHidden = e.target.checked;
                                        setSelectedTestcase(newTestcase);

                                        // update the isHidden field in sampleTestcases
                                        const testcaseIndex =
                                            sampleTestcases.findIndex(
                                                (testcase) =>
                                                    testcase.tempId ===
                                                    newTestcase.tempId
                                            );
                                        if (testcaseIndex !== -1) {
                                            const updatedTestcases = [
                                                ...sampleTestcases,
                                            ];
                                            updatedTestcases[
                                                testcaseIndex
                                            ].isHidden = e.target.checked;
                                            setSampleTestcases(
                                                updatedTestcases
                                            );
                                        }
                                    }}
                                    color="primary"
                                />
                            }
                            label="Is Hidden"
                        />
                    )}
                    {selectedTestcase.isTimeout && (
                        <Alert severity="error">
                            The program exceeded the expected time limit to run.
                        </Alert>
                    )}
                    {(selectedTestcase.expectedOutput ||
                        selectedTestcase.output) &&
                        !selectedTestcase.isTimeout &&
                        (isEditing ? (
                            <Box className="flex flex-col gap-1">
                                <InputLabel>Output: </InputLabel>
                                <TextField
                                    size="small"
                                    value={selectedTestcase.expectedOutput}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                    multiline
                                ></TextField>
                            </Box>
                        ) : (
                            <ReactDiffViewer
                                styles={{
                                    diffContainer: {
                                        width: "100%",
                                    },
                                    titleBlock: {
                                        width: "50%",
                                    },
                                    contentText: {
                                        wordBreak: "break-all",
                                    },
                                }}
                                leftTitle="Expected Output"
                                rightTitle="Your Output"
                                oldValue={selectedTestcase.expectedOutput}
                                newValue={selectedTestcase.output}
                                splitView={true}
                                showDiffOnly={false}
                            />
                        ))}
                </Box>
            )}
        </Box>
    );
}
