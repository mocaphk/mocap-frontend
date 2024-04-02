"use client";

import React from "react";
import { Box, Button, Dialog } from "@mui/material";
import CourseCard from "./components/CourseCard";
import CardWrapper from "@/app/components/CardWrapper";
import ComponentWrapper from "@/app/components/ComponentWrapper";
import NewCourseForm from "./components/NewCourseForm";

import AddIcon from "@mui/icons-material/Add";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useGetCoursesQuery } from "@/app/graphql/course/course.graphql";
import CustomSkeleton from "@/app/components/CustomSkeleton";
import NoResult from "@/app/errors/noResult";

export default function AllCoursesPage() {
    const { loading, error, data: coursesData } = useGetCoursesQuery();

    const courses = coursesData?.courses;

    const showErrorMessage =
        coursesData === undefined ||
        error ||
        courses === undefined ||
        courses === null ||
        courses.length === 0;

    const [open, setOpen] = React.useState(false);

    return (
        <CardWrapper>
            <ComponentWrapper
                Icon={MenuBookIcon}
                title="Courses"
                actionButton={
                    <Button
                        variant="outlined"
                        sx={{
                            borderRadius: 5,
                            textTransform: "none",
                            fontSize: 16,
                        }}
                        startIcon={<AddIcon />}
                        onClick={() => setOpen(true)}
                    >
                        New Course
                    </Button>
                }
            >
                {loading ? (
                    <Box className="flex flex-col gap-5 mt-2">
                        <CustomSkeleton
                            variant="rounded"
                            amount={3}
                            sx={{
                                padding: 2,
                                borderRadius: 3,
                                minHeight: 150,
                            }}
                        />
                    </Box>
                ) : showErrorMessage ? (
                    <NoResult
                        redirectTo="/home"
                        redirectToText="Back to home page"
                    />
                ) : (
                    <Box className="flex flex-col gap-5 mt-2">
                        {courses.map((course) => {
                            const createdBy = course.lecturers
                                .map((lecturer) => lecturer.username)
                                .join(", ");
                            return (
                                <CourseCard
                                    key={`${course.id}`}
                                    createdBy={createdBy}
                                    {...course}
                                />
                            );
                        })}
                    </Box>
                )}
            </ComponentWrapper>

            <Dialog
                onClose={() => setOpen(false)}
                open={open}
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <NewCourseForm />
            </Dialog>
        </CardWrapper>
    );
}
