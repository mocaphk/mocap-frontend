"use client";

import React from "react";
import { Box } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";
import CardWrapper from "@/app/components/CardWrapper";
import ComponentWrapper from "@/app/components/ComponentWrapper";
import { useGetCoursesCompletionQuery } from "@/app/graphql/course/course.graphql";
import CustomSkeleton from "@/app/components/CustomSkeleton";
import NoResult from "@/app/errors/noResult";

export default function TaskCompletion() {
    const theme = useTheme();

    // add the unit when hover
    const valueFormatter = (value: number) => `${value}%`;

    const { loading, error, data } = useGetCoursesCompletionQuery();

    const coursesCompletionData = data?.courses;

    const showErrorMessage =
        !loading &&
        (data === undefined ||
            error ||
            coursesCompletionData === undefined ||
            coursesCompletionData === null);

    const courseCodes: Array<string> = (coursesCompletionData ?? []).map(
        (course) => course.code
    );
    const courseProgress: Array<number> = (coursesCompletionData ?? []).map(
        (course) => course.completion ?? 0
    );
    const courseProgressInvert: Array<number> = courseProgress.map(
        (progress) => 100 - progress
    );
    // console.log(courseCodes, courseProgress, courseProgressInvert)
    const progress: Array<any> = [
        {
            data: courseProgress,
            stack: "progress",
            label: "done",
            valueFormatter,
        },
        {
            data: courseProgressInvert,
            stack: "progress",
            label: "not done",
            valueFormatter,
        },
    ];

    return (
        <CardWrapper>
            <ComponentWrapper Icon={DoneIcon} title="Task Completed">
                {loading ? (
                    <CustomSkeleton
                        width="100%"
                        height={460}
                        sx={{
                            mt: "-90px",
                            mb: "-70px",
                        }}
                    />
                ) : showErrorMessage || coursesCompletionData?.length === 0 ? (
                    <Box className="w-full h-[300px]">
                        <NoResult />
                    </Box>
                ) : (
                    <BarChart
                        margin={{ left: 100 }}
                        xAxis={[{ label: "progress (%)" }]}
                        yAxis={[{ scaleType: "band", data: courseCodes }]}
                        series={progress}
                        layout="horizontal"
                        colors={[
                            theme.palette.primary.main,
                            theme.palette.primary.light,
                        ]}
                        height={300}
                    />
                )}
            </ComponentWrapper>
        </CardWrapper>
    );
}
