import {
    Box,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography,
} from "@mui/material";
import React from "react";
import ReactDiffViewer from "react-diff-viewer";
import type {
    CodeExecutionOutput,
    CodeExecutionResult,
} from "../../../../../../.cache/__types__";
import { green, red } from "@mui/material/colors";
import { Collapse } from "@mui/material";

// ToDo: handle exceed time limit and execution fail
function ResultBar({
    result,
    index,
    allowEditOrCreate,
}: Readonly<{
    result: CodeExecutionResult;
    index: number;
    allowEditOrCreate: boolean;
}>) {
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    const expectedOutput = result?.sampleOutput
        ?.map((output: CodeExecutionOutput) => output.payload)
        .join("\n");

    const output = result?.output
        ?.map((output: CodeExecutionOutput) => output.payload)
        .join("\n");

    let msg = "";
    if (!result.isCorrect) {
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
            <ListItem
                onClick={handleClick}
                className={
                    !result.isCorrect && !result.isHidden
                        ? "rounded-lg w-full cursor-pointer"
                        : " rounded-lg w-full"
                }
                style={{
                    backgroundColor: result.isCorrect ? green[100] : red[100],
                }}
            >
                <ListItemText
                    primary={
                        result.isHidden
                            ? "Hidden Test Case"
                            : `Test Case ${index + 1}${msg}`
                    }
                />
            </ListItem>
            <Collapse
                in={
                    allowEditOrCreate
                        ? !result.isCorrect && open
                        : !result.isHidden && !result.isCorrect && open
                }
                timeout="auto"
                unmountOnExit
            >
                <Box className="flex flex-row items-center gap-1 p1">
                    <InputLabel>Arguments:</InputLabel>
                </Box>
                {result.input.map((input, index) => (
                    <Box
                        key={index}
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
                            label="value"
                            value={input.value}
                            InputProps={{
                                readOnly: true,
                            }}
                            autoComplete="off"
                        />
                    </Box>
                ))}

                <Box>
                    <ReactDiffViewer
                        leftTitle="Expected Output"
                        rightTitle="Your Output"
                        oldValue={expectedOutput}
                        newValue={output}
                        splitView={true}
                    />
                </Box>
            </Collapse>
        </Box>
    );
}

export default function ResultTab({
    results,
    allowEditOrCreate,
}: Readonly<{
    results: CodeExecutionResult[];
    allowEditOrCreate: boolean;
}>) {
    // const fakeResults: CodeExecutionResult[] = [
    //     {
    //         id: "1",
    //         isCorrect: true,
    //         input: [
    //             { name: "name", value: "value" },
    //             { name: "name2", value: "value2" },
    //         ],
    //         isExceedTimeLimit: false,
    //         isExecutionSuccess: false,
    //         isHidden: false,
    //         output: [],
    //         sampleOutput: [],
    //     },
    //     {
    //         id: "2",
    //         isCorrect: false,
    //         input: [
    //             { name: "name", value: "value" },
    //             { name: "name2", value: "value2" },
    //         ],
    //         isExceedTimeLimit: false,
    //         isExecutionSuccess: false,
    //         isHidden: false,
    //         output: [{ payload: "1234" }],
    //         sampleOutput: [{ payload: "123" }],
    //     },
    //     // Add more fake results as needed...
    // ];

    const sortedResults = [...results].sort(
        (a, b) => Number(a.isHidden) - Number(b.isHidden)
    );

    const filteredResults = [...results].filter((result) => !result.isHidden);

    if (results.length === 0) {
        return (
            <Box className="flex flex-col items-center justify-center w-full h-full">
                <Typography>No results to show</Typography>
            </Box>
        );
    }

    return (
        <List className="w-full" aria-label="mailbox folders">
            {allowEditOrCreate
                ? filteredResults?.map((result, index) => (
                      <ResultBar
                          key={index}
                          result={result}
                          index={index}
                          allowEditOrCreate={allowEditOrCreate}
                      />
                  ))
                : sortedResults?.map((result, index) => (
                      <ResultBar
                          key={index}
                          result={result}
                          index={index}
                          allowEditOrCreate={allowEditOrCreate}
                      />
                  ))}
        </List>
    );
}
