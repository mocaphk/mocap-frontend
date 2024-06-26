import React from "react";
import {
    Box,
    InputLabel,
    List,
    TextField,
    Collapse,
    Tooltip,
    Alert,
    Typography,
} from "@mui/material";
import ReactDiffViewer from "react-diff-viewer-continued";
import type { CodeExecutionOutput, CodeExecutionResult } from "@schema";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NoResult from "@/app/errors/noResult";

function ResultBar({
    isStart,
    isEnd,
    result,
    index,
    allowEditOrCreate,
}: Readonly<{
    isStart: boolean;
    isEnd: boolean;
    result: CodeExecutionResult;
    index: number;
    allowEditOrCreate: boolean;
}>) {
    const [open, setOpen] = React.useState(false);

    // close the result bar once result change
    React.useEffect(() => {
        setOpen(false);
    }, [result]);

    const disallowClick =
        result.isCorrect || (!allowEditOrCreate && result.isHidden);

    const handleClick = () => {
        // if correct or (not teacher and hidden testcase)
        if (disallowClick) {
            return;
        }

        setOpen(!open);
    };

    const expectedOutput = result?.sampleOutput
        ?.map((output: CodeExecutionOutput) => output.payload)
        .join("");

    const output = result?.output
        ?.map((output: CodeExecutionOutput) => output.payload)
        .join("");

    let msg = "";
    // isCorrect is null when the testcases are run with sample code only
    if (!result.isCorrect && result.isCorrect !== null) {
        if (result.isExceedTimeLimit) {
            msg = ": Exceed Time Limit";
        } else if (!result.isExecutionSuccess) {
            msg = ": Execution Failed";
        } else {
            msg = ": Wrong Answer";
        }
    }

    return (
        <Box className="">
            <Alert
                sx={{
                    ...(isStart && isEnd && !open
                        ? {
                              borderTopLeftRadius: "16px",
                              borderTopRightRadius: "16px",
                              borderBottomLeftRadius: "16px",
                              borderBottomRightRadius: "16px",
                          }
                        : isStart
                        ? {
                              borderTopLeftRadius: "16px",
                              borderTopRightRadius: "16px",
                              borderBottomLeftRadius: "0px",
                              borderBottomRightRadius: "0px",
                          }
                        : isEnd && !open
                        ? {
                              borderTopLeftRadius: "0px",
                              borderTopRightRadius: "0px",
                              borderBottomLeftRadius: "16px",
                              borderBottomRightRadius: "16px",
                          }
                        : { borderRadius: "0px" }),
                    ...(disallowClick
                        ? {}
                        : {
                              cursor: "pointer",
                              transition: "all 0.3s ease-in-out",
                          }),
                }}
                severity={
                    result.isCorrect === null
                        ? "success"
                        : result.isCorrect
                        ? "success"
                        : "error"
                }
                onClick={handleClick}
            >
                {result.isHidden
                    ? `Hidden Test Case${msg}`
                    : `Test Case ${index + 1}${msg}`}
            </Alert>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Box className="flex flex-col gap-2 py-2 px-1">
                    <Box className="flex flex-row items-center gap-1">
                        <InputLabel>Arguments:</InputLabel>
                        <Tooltip title="Input arguments will be passed to the program as standard input (stdin) in order.">
                            <HelpOutlineIcon
                                color="info"
                                sx={{ width: 18, height: 18 }}
                            />
                        </Tooltip>
                    </Box>
                    {result.input.map((input, idx) => (
                        <Box
                            key={idx}
                            className="flex flex-row w-full gap-3 items-center p-1"
                        >
                            <TextField
                                className="w-full"
                                color="primary"
                                type="text"
                                label="Name"
                                value={input.name}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField
                                className="w-full"
                                color="primary"
                                type="text"
                                label="Value"
                                value={input.value}
                                InputProps={{
                                    readOnly: true,
                                }}
                                autoComplete="off"
                            />
                        </Box>
                    ))}
                    {result.isCorrect === null ? (
                        <Box className="flex flex-col gap-1">
                            <InputLabel>Output: </InputLabel>
                            <TextField
                                size="small"
                                value={expectedOutput}
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
                            oldValue={expectedOutput}
                            newValue={output}
                            splitView={true}
                            showDiffOnly={false}
                        />
                    )}
                </Box>
            </Collapse>
        </Box>
    );
}

export default function ResultTab({
    isEditing,
    results,
    allowEditOrCreate,
}: Readonly<{
    isEditing: boolean;
    results: CodeExecutionResult[];
    allowEditOrCreate: boolean;
}>) {
    const sortedResults = [...results].sort(
        (a, b) => Number(a.isHidden) - Number(b.isHidden)
    );

    const filteredResults = [...results].filter((result) => !result.isHidden);

    const totalTestCasesLength = allowEditOrCreate
        ? filteredResults.length
        : sortedResults.length;

    const passedTestCasesLength = (
        allowEditOrCreate ? filteredResults : sortedResults
    ).filter((results) => results.isCorrect).length;

    if (results.length === 0) {
        return (
            <Box className="flex flex-col items-center justify-center w-full h-full">
                <NoResult />
            </Box>
        );
    }

    return (
        <Box className="flex flex-col gap-1">
            {!isEditing && (
                <Typography color="info.main" fontSize={18}>
                    {`Passed test cases: ${passedTestCasesLength} / ${totalTestCasesLength}`}
                </Typography>
            )}

            <List className="w-full">
                {allowEditOrCreate
                    ? filteredResults?.map((result, index) => (
                          <ResultBar
                              key={index}
                              isStart={index === 0}
                              isEnd={index === filteredResults.length - 1}
                              result={result}
                              index={index}
                              allowEditOrCreate={allowEditOrCreate}
                          />
                      ))
                    : sortedResults?.map((result, index) => (
                          <ResultBar
                              key={index}
                              isStart={index === 0}
                              isEnd={index === sortedResults.length - 1}
                              result={result}
                              index={index}
                              allowEditOrCreate={allowEditOrCreate}
                          />
                      ))}
            </List>
        </Box>
    );
}
