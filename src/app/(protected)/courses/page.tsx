"use client";

import { useSearchParams } from "next/navigation";
import { AssignmentStatus } from "@/enums/assignmentStatus";
import { AssignmentTypes } from "@/enums/assignmentTypes";
import type { CourseProps } from "./types/CourseProps";
import IndividualCoursePage from "./pages/IndividualCoursePage";
import AllCoursesPage from "./pages/AllCoursesPage";

export default function CoursesPage() {
    const searchParams = useSearchParams();

    const year = searchParams.get("year");
    const courseCode = searchParams.get("courseCode");

    const course: CourseProps = {
        year: "2024",
        courseCode: "COMP2396",
        courseTitle: "COMP2396 Object-oriented Programming and Java",
        createdBy: "Wong Kenneth",
        schoolSiteLinks: [
            {
                type: "Moodle",
                description: "HKU Moodle",
                link: "http://localhost:3000/moodlefake",
            },
        ],
        annoucements: [
            {
                id: "12345",
                title: "Tutorial 2 Released",
                date: "2023-4-13 4:20pm",
                createdBy: "Wong Kenneth",
            },
            {
                id: "12346",
                title: "Tutorial 1 Released",
                date: "2023-4-13 4:20pm",
                createdBy: "Wong Kenneth",
            },
            {
                id: "12347",
                title: "Tutorial 3 Released",
                date: "2023-4-13 4:20pm",
                createdBy: "Wong Kenneth",
            },
        ],
        assignments: [
            {
                id: "12349",
                title: "Tutorial 3",
                dueDate: "2023-4-20 11:59pm",
                status: AssignmentStatus.Completed,
                type: AssignmentTypes.Assignment,
            },
            {
                id: "12345",
                title: "Assignment 3",
                dueDate: "2023-4-20 11:59pm",
                status: AssignmentStatus.Ongoing,
                type: AssignmentTypes.Assignment,
            },
            {
                id: "12346",
                title: "Tutorial 2",
                dueDate: "2023-4-20 11:59pm",
                status: AssignmentStatus.Overdue,
                type: AssignmentTypes.Tutorial,
            },
            {
                id: "12347",
                title: "Assignment 1",
                dueDate: "2023-4-20 11:59pm",
                status: AssignmentStatus.Completed,
                type: AssignmentTypes.Assignment,
            },
            {
                id: "12348",
                title: "Tutorial 1",
                dueDate: "2023-4-20 11:59pm",
                status: AssignmentStatus.Completed,
                type: AssignmentTypes.Assignment,
            },
        ],
    };

    if (courseCode && year) {
        // try fetching, if exist return individual course page
        return <IndividualCoursePage {...course} />;
    }

    // fall back to all course page if not enough params filled or fetch fails
    return <AllCoursesPage />;
}
