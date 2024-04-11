import React from "react";
import {
    Box,
    TextField,
    FormControl,
    IconButton,
    Autocomplete,
} from "@mui/material";
import ConfirmIconButton from "@/app/components/ConfirmIconButton";
import { ProgrammingLanguage } from "@schema";

import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

export default function EditQuestionTab({
    editedQuestion,
    setEditedQuestion,
    handleSaveClick,
    handleCancelClick,
    handleDeleteClick,
    codingEnvironments,
}: Readonly<{
    editedQuestion: any;
    setEditedQuestion: Function;
    handleSaveClick: Function;
    handleCancelClick: Function;
    handleDeleteClick: Function;
    codingEnvironments: { id: number; name: string }[];
}>) {
    const confirmLeaveMsg = "Are you sure you want to discard your changes?";
    const confirmDeleteMsg = "Are you sure you want to delete this question?";

    const programmingLanguages = Object.values(ProgrammingLanguage);
    return (
        <Box>
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
                    label="Title"
                    value={editedQuestion.title}
                    onChange={(e) =>
                        setEditedQuestion({
                            ...editedQuestion,
                            title: e.target.value,
                        })
                    }
                    required
                />
                <Box className="flex flex-row gap-2">
                    <IconButton
                        color="success"
                        onClick={() => handleSaveClick()}
                    >
                        <SaveIcon />
                    </IconButton>
                    <ConfirmIconButton
                        Icon={CancelIcon}
                        color="error"
                        confirmBoxContent={confirmLeaveMsg}
                        onClick={() => handleCancelClick()}
                    />
                    <ConfirmIconButton
                        Icon={DeleteIcon}
                        color="error"
                        confirmBoxContent={confirmDeleteMsg}
                        onClick={() => handleDeleteClick()}
                    />
                </Box>
            </Box>
            <TextField
                variant="outlined"
                color="primary"
                sx={{
                    marginBottom: "1rem",
                }}
                label="Description"
                value={editedQuestion.description}
                onChange={(e) =>
                    setEditedQuestion({
                        ...editedQuestion,
                        description: e.target.value,
                    })
                }
                // need to add rows prop, otherwise, it will have "Too many re-renders" error.
                rows={6}
                fullWidth
                multiline
                required
            />
            <FormControl
                sx={{
                    marginBottom: "1rem",
                }}
                fullWidth
            >
                <Autocomplete
                    id="language-select"
                    options={programmingLanguages}
                    value={editedQuestion.language}
                    onChange={(event, newValue) => {
                        setEditedQuestion({
                            ...editedQuestion,
                            language: newValue,
                        });
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Language *"
                            variant="outlined"
                        />
                    )}
                />
            </FormControl>
            <FormControl
                sx={{
                    marginBottom: "1rem",
                }}
                fullWidth
            >
                <Autocomplete
                    id="coding-environment-select"
                    options={codingEnvironments}
                    getOptionLabel={(option) => option.name}
                    value={
                        codingEnvironments.find(
                            (env) =>
                                env.id.toString() ===
                                editedQuestion.codingEnvironmentId
                        ) || null
                    }
                    onChange={(event, newValue) => {
                        setEditedQuestion({
                            ...editedQuestion,
                            codingEnvironmentId: newValue ? newValue.id : "",
                        });
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Coding Environment *"
                            variant="outlined"
                        />
                    )}
                />
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
                placeholder="Replace the file path with {mainFile}"
                value={editedQuestion.execCommand}
                onChange={(e) =>
                    setEditedQuestion({
                        ...editedQuestion,
                        execCommand: e.target.value,
                    })
                }
                fullWidth
                required
            />
            <TextField
                color="primary"
                sx={{
                    marginBottom: "1rem",
                }}
                label="Time Limit (in milliseconds)"
                placeholder="1000"
                value={editedQuestion.timeLimit}
                onChange={(e) =>
                    setEditedQuestion({
                        ...editedQuestion,
                        timeLimit: e.target.value,
                    })
                }
                fullWidth
            />
            {/* ToDo: add is public */}
        </Box>
    );
}
