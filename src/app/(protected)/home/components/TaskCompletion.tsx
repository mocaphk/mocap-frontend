"use client";

import React from "react";
import ComponentWrapper from "./ComponentWrapper";
import DoneIcon from "@mui/icons-material/Done";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";

export default function TaskCompletion() {
    const theme = useTheme();

    // add the unit when hover
    const valueFormatter = (value: number) => `${value}%`;

    // may require to format the data or format it in backend
    // this is to show the require format
    const progress: Array<any> = [
        {
            data: [40, 70, 10, 23, 52, 12],
            stack: "progress",
            label: "done",
            valueFormatter,
        },
        {
            data: [60, 30, 90, 77, 48, 88],
            stack: "progress",
            label: "not done",
            valueFormatter,
        },
    ];
    const courseCodes: Array<string> = [
        "ENGG1340",
        "ENGG1330",
        "COMP2396",
        "COMP1234",
        "COMP2134",
        "COMP1245",
    ];

    return (
        <ComponentWrapper Icon={DoneIcon} title="Task Completed">
            <BarChart
                margin={{ left: 100 }}
                xAxis={[{ label: "progress (%)" }]}
                yAxis={[{ scaleType: "band", data: courseCodes }]}
                series={progress}
                layout="horizontal"
                colors={[
                    theme.palette.secondary.main,
                    theme.palette.secondary.light,
                ]}
                height={300}
            />
        </ComponentWrapper>
    );
}
