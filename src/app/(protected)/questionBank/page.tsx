"use client";

import React from "react";
import CardWrapper from "@/app/components/CardWrapper";
import ComponentWrapper from "@/app/components/ComponentWrapper";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import {
    Alert,
    Autocomplete,
    Box,
    Grid,
    IconButton,
    Snackbar,
    TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Table from "@/app/components/Table";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetCourseCodesQuery } from "@/app/graphql/course/course.graphql";
import { useSearchPublicQuestionsQuery } from "@/app/graphql/questionBank/questionBank.graphql";
import { UserRole } from "@schema";
import type { SearchPublicQuestionsInput } from "@schema";
import CustomSkeleton from "@/app/components/CustomSkeleton";
import type { GridRowParams } from "@mui/x-data-grid";
import { useCopyQuestionToAssignmentMutation } from "@/app/graphql/workspace/question.graphql";
import { useGetAssignmentUserRolesQuery } from "@/app/graphql/course/assignment.graphql";
import ErrorPage from "@/app/errors/errorPage";

export default function QuestionBankPage() {
    const searchParams = useSearchParams();
    const assignmentId = searchParams.get("assignmentId") ?? "";

    const { push } = useRouter();

    const [copyQuestionToAssignment, { error, loading }] =
        useCopyQuestionToAssignmentMutation();
    const [fetchError, setFetchError] = React.useState<boolean>(false);
    const [courseCode, setCourseCode] = React.useState<string | null>(null);

    const { loading: loadingCourseCodes, data: courseCodesData } =
        useGetCourseCodesQuery();
    const {
        loading: loadingQuestions,
        data: questionsData,
        refetch: refreshQuestions,
    } = useSearchPublicQuestionsQuery({
        skip: !courseCode,
        variables: {
            searchPublicQuestionsInput: {
                courseCode: courseCode ?? "",
                keyword: "",
            },
        },
    });

    const courseCodes = courseCodesData?.courseCodes ?? [];
    const questions = questionsData?.searchPublicQuestions ?? [];

    const onSearchSubmit: React.ComponentProps<typeof Box>["onSubmit"] = async (
        event
    ) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const formValues = Object.fromEntries(
            formData.entries()
        ) as SearchPublicQuestionsInput;

        refreshQuestions({
            searchPublicQuestionsInput: formValues,
        });
    };

    // check perms
    const { data: rolesData } = useGetAssignmentUserRolesQuery({
        skip: !assignmentId,
        variables: { assignmentId: assignmentId },
    });

    const roles = rolesData?.getAssignmentUserRoles;

    const isAdmin = roles?.includes(UserRole.Admin) ?? false;
    const isLecturer = roles?.includes(UserRole.Lecturer) ?? false;
    const isTutor = roles?.includes(UserRole.Tutor) ?? false;

    const allowCopyQuestion = isAdmin || isLecturer || isTutor;

    const showErrorMessage =
        !loading &&
        (rolesData === undefined ||
            error ||
            roles === undefined ||
            roles === null);

    const onRowClick = (params: GridRowParams) => {
        if (assignmentId) {
            // doing copy assignment
            onCopyQuestionToAssignment(params.row.questionId);
            return;
        }

        push(`/workspace?questionId=${params.row.questionId}`);
    };

    const onCopyQuestionToAssignment = async (questionId: string) => {
        const result = await copyQuestionToAssignment({
            variables: {
                questionId: questionId,
                assignmentId: assignmentId,
            },
        });

        const newQuestion = result?.data?.copyQuestionToAssignment;

        const error =
            result?.errors !== undefined ||
            newQuestion === null ||
            newQuestion === undefined;

        setFetchError(error);
        if (error) {
            return;
        }

        // redirect back to assignment page
        push(`assignment?id=${assignmentId}`);
    };

    if (assignmentId && showErrorMessage) {
        // may such assignment do not exist
        return (
            <ErrorPage
                title="Assignment not found"
                message="It appears that the assignment you intended to link the question to does not exist."
                returnLink="questionBank"
                returnMessage="Back to question bank"
            />
        );
    }

    if (assignmentId && !allowCopyQuestion) {
        return (
            <ErrorPage
                title="No permission"
                message="It appears that you do not have the necessary permissions to create a question for this course."
                returnMessage="Back to course page"
                returnLink={`assignment?id=${assignmentId}`}
            />
        );
    }

    return (
        <CardWrapper className="h-full">
            <ComponentWrapper
                Icon={AccountBalanceIcon}
                title="Question Bank"
                fullHeight
            >
                <Box className="h-full flex flex-col mt-2">
                    <Box className="flex flex-col gap-2 mb-2">
                        {assignmentId && (
                            <Alert severity="info">
                                Please choose a question to copy for the
                                assignment.
                            </Alert>
                        )}
                        {(error || fetchError) && (
                            <Alert severity="error">
                                Failed to copy question. Please try again.
                            </Alert>
                        )}
                    </Box>
                    {loadingCourseCodes ? (
                        <CustomSkeleton
                            sx={{ minWidth: "100%", minHeight: 100 }}
                        ></CustomSkeleton>
                    ) : (
                        <Box
                            id="question-bank-search-form"
                            component="form"
                            onSubmit={onSearchSubmit}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={5}>
                                    <Autocomplete
                                        className="w-full"
                                        autoFocus={true}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                name="courseCode"
                                                label="Course Code"
                                                required
                                            />
                                        )}
                                        value={courseCode}
                                        onChange={(event, newValue) => {
                                            setCourseCode(newValue);
                                        }}
                                        options={courseCodes}
                                        autoHighlight
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={7}>
                                    <Box className="flex flex-row items-center gap-2">
                                        <TextField
                                            id="keyword"
                                            name="keyword"
                                            className="w-full"
                                            label="Keyword"
                                            type="text"
                                            autoComplete="off"
                                        />
                                        <IconButton
                                            className="w-fit h-fit"
                                            color="info"
                                            aria-label="search"
                                            type="submit"
                                        >
                                            <SearchIcon />
                                        </IconButton>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    <Box className="flex-grow">
                        <Table
                            rows={questions.map((question) => {
                                const assignment = question?.assignment;
                                const course = assignment?.course;

                                return {
                                    questionId: question.id,
                                    courseCode: course?.code,
                                    courseTitle: course?.name,
                                    year: course?.year,
                                    title: question.title,
                                    description: question.description,
                                };
                            })}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        questionId: false,
                                    },
                                },
                            }}
                            columns={[
                                {
                                    field: "questionId",
                                    headerName: "Question Id",
                                },
                                {
                                    field: "courseCode",
                                    headerName: "Course Code",
                                    minWidth: 110,
                                },
                                {
                                    field: "courseTitle",
                                    headerName: "Course Title",
                                    minWidth: 200,
                                },
                                {
                                    field: "year",
                                    headerName: "Year",
                                },
                                {
                                    field: "title",
                                    headerName: "Title",
                                    minWidth: 300,
                                },
                                {
                                    field: "description",
                                    headerName: "Description",
                                },
                            ]}
                            getRowId={(row) => row.questionId}
                            onRowClick={onRowClick}
                            loading={loadingQuestions}
                        ></Table>
                    </Box>
                </Box>
            </ComponentWrapper>
            <Snackbar open={loading}>
                <Alert severity="info" variant="filled" sx={{ width: "100%" }}>
                    Copying question...
                </Alert>
            </Snackbar>
        </CardWrapper>
    );
}
