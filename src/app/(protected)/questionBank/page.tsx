"use client";

import React from "react";
import CardWrapper from "@/app/components/CardWrapper";
import ComponentWrapper from "@/app/components/ComponentWrapper";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { Autocomplete, Box, Grid, IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Table from "@/app/components/Table";
import { useRouter } from "next/navigation";

export default function QuestionBankPage() {
    const { push } = useRouter();

    const fakeCourseOptions = [
        { label: "ENGG1330 Computer Programming I", id: "ENGG1330" },
        { label: "ENGG1340 Computer Programming II", id: "ENGG1340" },
    ];

    const fakeQuestions = [
        {
            questionId: "1",
            courseCode: "ENGG1330",
            year: "2019",
            title: "Assignment 1",
            description: "Variables and Arithmetics",
        },
        {
            questionId: "2",
            courseCode: "ENGG1330",
            year: "2020",
            title: "Assignment 1",
            description: "Variables and Arithmetics",
        },
        {
            questionId: "3",
            courseCode: "ENGG1330",
            year: "2021",
            title: "Assignment 1",
            description: "Variables",
        },
    ];

    const [questions, setQuestions] = React.useState<typeof fakeQuestions>([]);

    return (
        <CardWrapper className="h-full">
            <ComponentWrapper
                Icon={AccountBalanceIcon}
                title="Question Bank"
                fullHeight
            >
                <Box className="h-full flex flex-col mt-2">
                    <Box
                        id="question-bank-search-form"
                        component="form"
                        onSubmit={(e) => {
                            // TODO: implement search
                            e.preventDefault();
                            setQuestions(fakeQuestions);
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={5}>
                                <Autocomplete
                                    className="w-full"
                                    color="secondary"
                                    autoFocus={true}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            color="secondary"
                                            label="Course"
                                            required
                                        />
                                    )}
                                    options={fakeCourseOptions}
                                    autoHighlight
                                    isOptionEqualToValue={(options, value) =>
                                        options.id == value.id
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={7}>
                                <Box className="flex flex-row">
                                    <TextField
                                        id="keyword"
                                        name="keyword"
                                        className="w-full"
                                        label="Keyword"
                                        color="secondary"
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
                    <Box className="flex-grow">
                        <Table
                            rows={questions}
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
                                    field: "year",
                                    headerName: "Year",
                                },
                                {
                                    field: "title",
                                    headerName: "Title",
                                    minWidth: 200,
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
                        ></Table>
                    </Box>
                </Box>
            </ComponentWrapper>
        </CardWrapper>
    );
}
