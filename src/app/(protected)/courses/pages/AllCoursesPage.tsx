import MenuBookIcon from "@mui/icons-material/MenuBook";
import type { CourseCardProps } from "../types/CourseCardProps";
import ComponentWrapper from "@/app/components/ComponentWrapper";
import { Box } from "@mui/material";
import CourseCard from "../components/CourseCard";

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

    return (
        <ComponentWrapper Icon={MenuBookIcon} title="Courses">
            <Box className="flex flex-col gap-5 mt-2">
                {courseList.map((course) => (
                    <CourseCard
                        key={`${course.courseCode}${course.year}`}
                        {...course}
                    />
                ))}
            </Box>
        </ComponentWrapper>
    );
}
