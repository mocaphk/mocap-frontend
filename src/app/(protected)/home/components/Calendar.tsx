"use client";

import React from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import Box from "@mui/material/Box";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WeekPicker from "./WeekPicker";
import type { AssignmentWrapperProps } from "../types/AssignmentWrapperProps";
import AssignmentWrapper from "./AssignmentWrapper";
import CardWrapper from "@/app/components/CardWrapper";
import ComponentWrapper from "@/app/components/ComponentWrapper";
import { useGetAssignmentBetweenQuery } from "@/app/graphql/course/assignment.graphql";
import type { AssignmentCardProps } from "../types/AssignmentCardProps";
import NoResult from "@/app/errors/noResult";
import CustomSkeleton from "@/app/components/CustomSkeleton";

export default function Calendar() {
    const [hoveredDay, setHoveredDay] = React.useState<Dayjs | null>(null);
    const [value, setValue] = React.useState<Dayjs | null>(dayjs());

    const { loading, error, data } = useGetAssignmentBetweenQuery({
        skip: !value,
        variables: {
            startDate:
                value?.startOf("week").format("YYYY-MM-DD HH:mm:ss") ?? "",
            endDate: value?.endOf("week").format("YYYY-MM-DD HH:mm:ss") ?? "",
        },
    });

    const assignmentData = data?.assignmentsBetween;

    const showErrorMessage =
        !loading &&
        (data === undefined ||
            error ||
            assignmentData === undefined ||
            assignmentData === null);

    const groupedAssignments: {
        [key: string]: { assignment: AssignmentCardProps }[];
    } = {};

    data?.assignmentsBetween.forEach((assignment) => {
        const dateDue = dayjs(assignment.dateDue);
        const date = dateDue.format("YYYY-MM-DD");

        if (!groupedAssignments[date]) {
            groupedAssignments[date] = [];
        }
        groupedAssignments[date].push({
            assignment: {
                id: assignment.id,
                title: assignment.title,
                courseCode: assignment.course.code,
                dateDue: assignment.dateDue,
                completion: assignment.completion ?? 0,
            },
        });
    });

    const assignments: Array<AssignmentWrapperProps> = Object.entries(
        groupedAssignments
    ).map(([dueDate, assignments]) => ({
        dueDate,
        assignments: assignments.map((item) => item.assignment),
    }));

    return (
        <CardWrapper>
            <ComponentWrapper Icon={CalendarMonthIcon} title="Calendar">
                {/* min height following fixed size of calendar */}
                <Box className="flex flex-row flex-wrap gap-12 min-h-[280px]">
                    <WeekPicker
                        value={value}
                        setValue={setValue}
                        hoveredDay={hoveredDay}
                        setHoveredDay={setHoveredDay}
                        sx={{
                            marginTop: "-10px",
                            marginBottom: "-80px",
                        }}
                    />
                    {loading ? (
                        <Box className="flex flex-col gap-3 w-[360px] h-[260px]">
                            <CustomSkeleton
                                variant="rounded"
                                amount={3}
                                width={350}
                                height={60}
                                sx={{
                                    borderRadius: 3,
                                }}
                            />
                        </Box>
                    ) : showErrorMessage || assignments.length === 0 ? (
                        <Box className="w-[360px] h-[260px] bg-[#f8fafc] rounded-3xl">
                            <NoResult />
                        </Box>
                    ) : (
                        <Box
                            // set max height for scrolling
                            // 10px right padding for the scrollbar
                            className="flex flex-col gap-4 max-h-[290px] overflow-y-auto pr-[10px] pb-2"
                            sx={{ scrollbarWidth: "thin" }}
                        >
                            {assignments.map((assignment) => (
                                <AssignmentWrapper
                                    key={assignment.dueDate}
                                    {...assignment}
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            </ComponentWrapper>
        </CardWrapper>
    );
}
