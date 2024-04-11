"use client";

import React from "react";
import CardWrapper from "@/app/components/CardWrapper";
import ComponentWrapper from "@/app/components/ComponentWrapper";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { Autocomplete, Box, Grid, IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Table from "@/app/components/Table";
import { useRouter } from "next/navigation";
import { useGetCourseCodesQuery } from "@/app/graphql/course/course.graphql";
import { useSearchPublicQuestionsQuery } from "@/app/graphql/questionBank/questionBank.graphql";
import type { SearchPublicQuestionsInput } from "@schema";
import CustomSkeleton from "@/app/components/CustomSkeleton";

export default function QuestionBankPage() {
    const { push } = useRouter();

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
        ) as unknown as SearchPublicQuestionsInput;

        refreshQuestions({
            searchPublicQuestionsInput: formValues,
        });
    };

    return (
        <CardWrapper className="h-full">
            <ComponentWrapper
                Icon={AccountBalanceIcon}
                title="Question Bank"
                fullHeight
            >
                <Box className="h-full flex flex-col mt-2">
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
                                    <Box className="flex flex-row">
                                        <TextField
                                            id="keyword"
                                            name="keyword"
                                            className="w-full"
                                            label="Keyword"
                                            type="text"
                                            autoComplete="off"
                                        />
                                        <IconButton
                                            color="info"
                                            sx={{ m: 1 }}
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
                            onRowClick={(params) => {
                                push(
                                    `/workspace?questionId=${params.row.questionId}`
                                );
                            }}
                            loading={loadingQuestions}
                        ></Table>
                    </Box>
                </Box>
            </ComponentWrapper>
        </CardWrapper>
    );
}
