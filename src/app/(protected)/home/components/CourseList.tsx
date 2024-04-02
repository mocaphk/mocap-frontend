"use client";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import CourseCard from "./CourseCard";
import Box from "@mui/material/Box";

import CardWrapper from "@/app/components/CardWrapper";
import ComponentWrapper from "@/app/components/ComponentWrapper";
import { useGetCoursesQuery } from "@/app/graphql/course/course.graphql";
import CustomSkeleton from "@/app/components/CustomSkeleton";
import NoResult from "@/app/errors/noResult";

export default function CourseList() {
    const { loading, error, data: coursesData } = useGetCoursesQuery();

    const courses = coursesData?.courses;

    const showErrorMessage =
        coursesData === undefined ||
        error ||
        courses === undefined ||
        courses === null ||
        courses.length === 0;

    return (
        <CardWrapper>
            <ComponentWrapper Icon={MenuBookIcon} title="Courses">
                {loading ? (
                    <Box
                        className="flex flex-row gap-12 overflow-x-auto pb-2"
                        sx={{ scrollbarWidth: "thin" }}
                    >
                        <CustomSkeleton
                            variant="rounded"
                            amount={4}
                            sx={{
                                padding: 2,
                                borderRadius: 3,
                                minWidth: 230,
                                minHeight: 230,
                            }}
                        />
                    </Box>
                ) : showErrorMessage ? (
                    <NoResult />
                ) : (
                    <Box
                        className="flex flex-row gap-12 overflow-x-auto pb-2"
                        sx={{ scrollbarWidth: "thin" }}
                    >
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
        </CardWrapper>
    );
}
