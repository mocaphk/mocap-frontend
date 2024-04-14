import NoResult from "@/app/errors/noResult";
import { useGetLatestSubmissionByQuestionIdAndUserIdLazyQuery } from "@/app/graphql/workspace/attempt.graphql";
import {
    Autocomplete,
    Box,
    Button,
    TextField,
    Typography,
} from "@mui/material";
import React from "react";
import HistoryIcon from "@mui/icons-material/History";

export default function UserTab({
    questionId,
    submittedStudents,
    selectedStudent,
    setSelectedStudent,
    studentSubmittedAt,
    setStudentSubmittedAt,
    setCodeOnEditor,
}: Readonly<{
    questionId: string;
    submittedStudents: { id: string; username: string }[];
    selectedStudent: { id: string; username: string } | undefined;
    setSelectedStudent: Function;
    studentSubmittedAt: string;
    setStudentSubmittedAt: Function;
    setCodeOnEditor: Function;
}>) {
    const [getLatestSubmissionFunc, { data: attemptData }] =
        useGetLatestSubmissionByQuestionIdAndUserIdLazyQuery({
            onCompleted: (data) => {
                setCodeOnEditor(data.latestSubmission?.code);
                setStudentSubmittedAt(data.latestSubmission?.updatedAt ?? "");
            },
        });

    const handleReview = () => {
        if (selectedStudent) {
            getLatestSubmissionFunc({
                variables: {
                    questionId: questionId,
                    userId: selectedStudent.id,
                },
            });
        }
    };

    if (submittedStudents.length === 0) {
        return (
            <Box className="flex flex-col items-center justify-center w-full h-full">
                <NoResult />
            </Box>
        );
    }

    return (
        <Box className="flex flex-col h-full justify-between">
            <Autocomplete
                className="w-full"
                value={selectedStudent}
                onChange={(event, newValue) => {
                    setSelectedStudent(newValue || selectedStudent);
                    setStudentSubmittedAt("");
                }}
                autoFocus={true}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        name="username"
                        label="Username"
                        required
                    />
                )}
                options={submittedStudents}
                getOptionLabel={(option) => option.username}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                autoHighlight
            />
            <Box className="flex flex-col items-end">
                <Box className="flex flex-col items-end gap-1">
                    {studentSubmittedAt !== "" && (
                        <Typography color="info.light" fontSize={15}>
                            Submission time: {studentSubmittedAt}
                        </Typography>
                    )}
                    <Button
                        sx={{ px: 3 }}
                        color="primary"
                        variant="contained"
                        startIcon={<HistoryIcon />}
                        onClick={handleReview}
                    >
                        Review
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
