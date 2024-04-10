import React from "react";
import {
    Box,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { ProgrammingLanguage } from "@schema";

export default function EditQuestionTab({
    editedQuestion,
    setEditedQuestion,
    handleSaveClick,
    handleCancelClick,
    codingEnvironments,
}: Readonly<{
    editedQuestion: any;
    setEditedQuestion: Function;
    handleSaveClick: Function;
    handleCancelClick: Function;
    codingEnvironments: { id: number; name: string }[];
}>) {
    const programmingLanguages = Object.values(ProgrammingLanguage);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                }}
            >
                <TextField
                    variant="outlined"
                    color="primary"
                    label="Question title"
                    value={editedQuestion.title}
                    onChange={(e) =>
                        setEditedQuestion({
                            ...editedQuestion,
                            title: e.target.value,
                        })
                    }
                />
                <Box>
                    <Button
                        sx={{
                            marginRight: "1rem",
                        }}
                        className="h-fit w-36"
                        color="primary"
                        variant="contained"
                        onClick={() => handleSaveClick()}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleCancelClick()}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
            <TextField
                variant="outlined"
                color="primary"
                sx={{
                    marginBottom: "1rem",
                }}
                label="Question description"
                value={editedQuestion.description}
                onChange={(e) =>
                    setEditedQuestion({
                        ...editedQuestion,
                        description: e.target.value,
                    })
                }
                // need to add rows prop, otherwise, it will have "Too many re-renders" error.
                rows={10}
                fullWidth
                multiline
            />
            <FormControl
                sx={{
                    marginBottom: "1rem",
                }}
                fullWidth
            >
                <InputLabel
                    id="language-select-label"
                    color="primary"
                    variant="outlined"
                >
                    Language
                </InputLabel>
                <Select
                    color="primary"
                    variant="outlined"
                    labelId="language-select-label"
                    label="Language"
                    id="language-select"
                    value={editedQuestion.language}
                    onChange={(e) =>
                        setEditedQuestion({
                            ...editedQuestion,
                            language: e.target.value,
                        })
                    }
                >
                    {programmingLanguages.map((language) => (
                        <MenuItem key={language} value={language}>
                            {language}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl
                sx={{
                    marginBottom: "1rem",
                }}
                fullWidth
            >
                <InputLabel
                    id="coding-environment-select-label"
                    color="primary"
                >
                    Coding Environment
                </InputLabel>
                {/* try autocomplete */}
                <Select
                    color="primary"
                    labelId="coding-environment-select-label"
                    label="Coding Environment"
                    id="coding-environment-select"
                    value={editedQuestion.codingEnvironmentId}
                    onChange={(e) =>
                        setEditedQuestion({
                            ...editedQuestion,
                            codingEnvironmentId: e.target.value,
                        })
                    }
                >
                    {codingEnvironments.map((environment) => (
                        <MenuItem key={environment.id} value={environment.id}>
                            {environment.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                color="primary"
                sx={{
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    "& .MuiInputLabel-outlined": {
                        color: "#2e2e2e",
                    },
                    marginBottom: "1rem",
                }}
                label="Execute Command"
                value={editedQuestion.execCommand}
                onChange={(e) =>
                    setEditedQuestion({
                        ...editedQuestion,
                        execCommand: e.target.value,
                    })
                }
                fullWidth
            />
            <TextField
                color="primary"
                sx={{
                    marginBottom: "1rem",
                }}
                label="Time Limit (in milliseconds)"
                value={editedQuestion.timeLimit}
                onChange={(e) =>
                    setEditedQuestion({
                        ...editedQuestion,
                        timeLimit: e.target.value,
                    })
                }
                fullWidth
            />
        </>
    );
}
