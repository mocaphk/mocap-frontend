"use client";

import React from "react";
import { Box, Button, Dialog } from "@mui/material";
import type { CourseCardProps } from "../types/CourseCardProps";
import type { NewCourseProps } from "../types/NewCourseProps";
import CourseCard from "../components/CourseCard";
import CardWrapper from "@/app/components/CardWrapper";
import ComponentWrapper from "@/app/components/ComponentWrapper";
import NewCourseForm from "../components/NewCourseForm";

import AddIcon from "@mui/icons-material/Add";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export default function AllCoursesPage() {
    // fetch all courses of the user here
    const courseList: Array<CourseCardProps> = [
        {
            year: 2024,
            courseCode: "ENGG1330",
            courseTitle: "ENGG1330 Computer Programming I",
            courseShortDescription: "Python Introductory Course",
            createdBy: "Schnieders Dirk",
        },
        {
            year: 2024,
            courseCode: "ENGG1340",
            courseTitle: "ENGG1340 Computer Programming II",
            courseShortDescription: "C/C++ Introductory Course",
            createdBy: "Luo Ruibang",
        },
    ];

    const [open, setOpen] = React.useState(false);
    const [newCourseInfo, setNewCourseInfo] = React.useState<NewCourseProps>({
        courseCode: "",
        courseTitle: "",
        courseShortDescription: "",
        barColor: "#000000",
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setNewCourseInfo((values) => ({ ...values, [name]: value }));
    };

    return (
        <CardWrapper>
            <ComponentWrapper
                Icon={MenuBookIcon}
                title="Courses"
                actionButton={
                    <Button
                        color="secondary"
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
                <Box className="flex flex-col gap-5 mt-2">
                    {courseList.map((course) => (
                        <CourseCard
                            key={`${course.courseCode}${course.year}`}
                            {...course}
                        />
                    ))}
                </Box>
            </ComponentWrapper>

            <Dialog
                onClose={() => setOpen(false)}
                open={open}
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <NewCourseForm
                    form={newCourseInfo}
                    handleChange={handleChange}
                />
            </Dialog>
        </CardWrapper>
    );
}
