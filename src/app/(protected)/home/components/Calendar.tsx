"use client";

import React from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import Box from "@mui/material/Box";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ComponentWrapper from "./ComponentWrapper";
import WeekPicker from "./WeekPicker";
import type { AssignmentWrapperProps } from "../types/AssignmentWrapperProps";
import AssignmentWrapper from "./AssignmentWrapper";

export default function Calendar() {
    const [hoveredDay, setHoveredDay] = React.useState<Dayjs | null>(null);
    const [value, setValue] = React.useState<Dayjs | null>(dayjs("2022-04-17"));

    // login of getting the range of date (get a week from a value) can be work in backend
    // assume getting a processed data
    const assignments: Array<AssignmentWrapperProps> = [
        {
            dueDate: "2023-4-13",
            assignemnts: [
                {
                    title: "Assignment 1",
                    courseCode: "COMP2396",
                    dueTime: "11:59 PM",
                    barColor: "cyan",
                },
                {
                    title: "Assignment 2",
                    courseCode: "COMP2396",
                    dueTime: "11:59 PM",
                    barColor: "red",
                },
            ],
        },
        {
            dueDate: "2023-4-15",
            assignemnts: [
                {
                    title: "Assignment 1",
                    courseCode: "ENGG1340",
                    dueTime: "11:59 PM",
                    barColor: "lime",
                },
            ],
        },
    ];

    return (
        <ComponentWrapper Icon={CalendarMonthIcon} title="Calendar">
            <Box className="flex flex-row gap-12">
                <WeekPicker
                    value={value}
                    setValue={setValue}
                    hoveredDay={hoveredDay}
                    setHoveredDay={setHoveredDay}
                    sx={{
                        marginTop: "-10px",
                        marginBottom: "-35px",
                    }}
                />
                <Box
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
            </Box>
        </ComponentWrapper>
    );
}
