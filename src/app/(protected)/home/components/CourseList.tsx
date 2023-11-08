import ComponentWrapper from "./ComponentWrapper";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CourseCard from "./CourseCard";
import Box from "@mui/material/Box";

import type { CourseCardProps } from "../types/CourseCardProps";

export default function CourseList() {
    // prob fetch course list here
    const courseList: Array<CourseCardProps> = [
        {
            courseTitle: "ENGG1330 Computer Programming I",
            courseShortDescription: "Python Introductory Course",
            createdBy: "Schnieders Dirk",
            barColor: "red",
        },
        {
            courseTitle: "ENGG1340 Computer Programming II",
            courseShortDescription: "C/C++ Introductory Course",
            createdBy: "Luo Ruibang",
            barColor: "lime",
        },
    ];

    return (
        <ComponentWrapper Icon={MenuBookIcon} title="Courses">
            <Box className="flex flex-row space-x-12">
                {courseList.map((course) => (
                    <CourseCard
                        key={course.courseTitle}
                        {...course}
                    />
                ))}
            </Box>
        </ComponentWrapper>
    );
}
