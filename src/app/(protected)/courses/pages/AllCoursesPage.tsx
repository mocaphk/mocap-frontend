"use client";

import React from "react";
import AddIcon from "@mui/icons-material/Add";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import type { CourseCardProps } from "../types/CourseCardProps";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import CourseCard from "../components/CourseCard";
import CardWrapper from "@/app/components/CardWrapper";
import ComponentWrapper from "@/app/components/ComponentWrapper";

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
    const [newCourseInfo, setNewCourseInfo] = React.useState({
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
                <DialogTitle color="info.main">New Course</DialogTitle>

                <Box
                    id="new-course-form"
                    component="form"
                    action="ToBeChanged"
                    method="post"
                    className="w-full flex flex-col px-4 my-2"
                >
                    <Grid container className="w-full my-2" spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                id="courseCode"
                                name="courseCode"
                                className="w-full"
                                label="Course Code"
                                color="secondary"
                                type="text"
                                autoFocus={true}
                                autoComplete="off"
                                value={newCourseInfo.courseCode}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="courseTitle"
                                name="courseTitle"
                                className="w-full"
                                label="Course Title"
                                color="secondary"
                                type="text"
                                autoComplete="off"
                                value={newCourseInfo.courseTitle}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="courseShortDescription"
                                name="courseShortDescription"
                                className="w-full"
                                label="Course Short Description"
                                color="secondary"
                                type="text"
                                autoComplete="off"
                                value={newCourseInfo.courseShortDescription}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="barColor"
                                name="barColor"
                                className="w-full"
                                label="Course Bar Color"
                                color="secondary"
                                type="color"
                                autoComplete="off"
                                value={newCourseInfo.barColor}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                id="new-course-button"
                                name="submit"
                                className="w-full"
                                type="submit"
                                variant="contained"
                                color="secondary"
                            >
                                <Typography className="p-2">Add</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>
        </CardWrapper>
    );
}
