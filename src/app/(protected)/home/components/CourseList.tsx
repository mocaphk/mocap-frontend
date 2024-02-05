import MenuBookIcon from "@mui/icons-material/MenuBook";
import CourseCard from "./CourseCard";
import Box from "@mui/material/Box";

import type { CourseCardProps } from "../types/CourseCardProps";
import CardWrapper from "@/app/components/CardWrapper";
import ComponentWrapper from "@/app/components/ComponentWrapper";

export default function CourseList() {
    // prob fetch course list here
    const courseList: Array<CourseCardProps> = [
        {
            year: 2024,
            courseCode: "ENGG1330",
            courseTitle: "ENGG1330 Computer Programming I",
            courseShortDescription: "Python Introductory Course",
            createdBy: "Schnieders Dirk",
            barColor: "red",
        },
        {
            year: 2024,
            courseCode: "ENGG1340",
            courseTitle: "ENGG1340 Computer Programming II",
            courseShortDescription: "C/C++ Introductory Course",
            createdBy: "Luo Ruibang",
            barColor: "lime",
        },
    ];

    return (
        <CardWrapper>
            <ComponentWrapper Icon={MenuBookIcon} title="Courses">
                <Box
                    className="flex flex-row gap-12 overflow-x-auto pb-2"
                    sx={{ scrollbarWidth: "thin" }}
                >
                    {courseList.map((course) => (
                        <CourseCard
                            key={`${course.courseCode}${course.year}`}
                            {...course}
                        />
                    ))}
                </Box>
            </ComponentWrapper>
        </CardWrapper>
    );
}
