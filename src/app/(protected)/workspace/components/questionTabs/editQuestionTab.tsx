import React from "react";
import {
    Box,
    TextField,
    FormControl,
    IconButton,
    Autocomplete,
    Checkbox,
    FormControlLabel,
    Dialog,
    InputAdornment,
} from "@mui/material";
import ConfirmIconButton from "@/app/components/ConfirmIconButton";
import { ProgrammingLanguage } from "@schema";
import type { Question } from "../../types/Question";

import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import NewEnvironmentForm from "../NewEnvironmentForm";
import type { GetCodingEnvironmentByAssignmentIdQuery } from "@/app/graphql/workspace/codingEnvironment.graphql";
import type { QueryResult } from "@apollo/client";

export default function EditQuestionTab({
    courseId,
    editedQuestion,
    setEditedQuestion,
    handleSaveClick,
    handleCancelClick,
    handleDeleteClick,
    codingEnvironments,
    refetchEnv,
}: Readonly<{
    courseId: string;
    editedQuestion: Question;
    setEditedQuestion: Function;
    handleSaveClick: Function;
    handleCancelClick: Function;
    handleDeleteClick: Function;
    codingEnvironments: { id: number; name: string }[];
    refetchEnv: QueryResult<GetCodingEnvironmentByAssignmentIdQuery>["refetch"];
}>) {
    const confirmLeaveMsg = "Are you sure you want to discard your changes?";
    const confirmDeleteMsg = "Are you sure you want to delete this question?";

    const [openNewEnvPopup, setOpenNewEnvPopup] = React.useState(false);

    const programmingLanguages = Object.values(ProgrammingLanguage);
    return (
        <Box className="flex flex-col gap-4 mt-4">
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <TextField
                    variant="outlined"
                    color="primary"
                    label="Title"
                    sx={{ width: "70%" }}
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
            <FormControl fullWidth>
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
            <Box className="flex flex-row gap-2 items-center">
                <FormControl fullWidth>
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
                                codingEnvironmentId: newValue
                                    ? newValue.id.toString()
                                    : "",
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
                <IconButton
                    className="w-fit h-fit"
                    onClick={() => setOpenNewEnvPopup(true)}
                >
                    <UploadFileIcon />
                </IconButton>
            </Box>
            <TextField
                color="primary"
                sx={{
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    "& .MuiInputLabel-outlined": {
                        color: "#2e2e2e",
                    },
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
                label="Time Limit (in milliseconds)"
                placeholder="1000"
                value={editedQuestion.timeLimit}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">ms</InputAdornment>
                    ),
                }}
                onChange={(e) =>
                    setEditedQuestion({
                        ...editedQuestion,
                        timeLimit: e.target.value,
                    })
                }
                fullWidth
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={editedQuestion.isPublic ?? true}
                        onChange={(e) =>
                            setEditedQuestion({
                                ...editedQuestion,
                                isPublic: e.target.checked,
                            })
                        }
                        color="primary"
                    />
                }
                label="Public"
                sx={{ mt: -1 }}
            />
            <Dialog
                onClose={() => setOpenNewEnvPopup(false)}
                open={openNewEnvPopup}
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <NewEnvironmentForm
                    courseId={courseId}
                    refetch={refetchEnv}
                    closeForm={() => setOpenNewEnvPopup(false)}
                />
            </Dialog>
        </Box>
    );
}
