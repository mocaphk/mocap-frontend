"use client";

import { useSearchParams } from "next/navigation";
import AssignmentNotFoundPage from "./pages/AssignmentNotFoundPage";
import DetailedAssignmentPage from "./pages/DetailedAssignmentPage";
import type { AssignmentProps } from "./types/AssignmentProps";
import { AssignmentStatus } from "@/enums/assignmentStatus";
import { AssignmentTypes } from "@/enums/assignmentTypes";
import { QuestionStatus } from "./types/QuestionProps";

export default function AssignmentPage() {
    const searchParams = useSearchParams();

    const year = searchParams.get("year");
    const courseCode = searchParams.get("courseCode");
    const assignmentId = searchParams.get("assignmentId");

    const assignmentTemplate: AssignmentProps = {
        id: "1",
        title: "Assignment 1",
        description:
            "In this assignment, you will have the opportunity to delve into the fundamentals of Java programming. You will explore essential concepts, such as variables, data types, control structures, functions, and object-oriented programming principles. Through practical exercises and examples, you will gain a solid understanding of Java and how to apply its features in real-world scenarios. By the end of the assignment, you will have a strong foundation in Java programming, preparing you to tackle more advanced topics and projects with confidence.",
        dueDate: "2024-3-10",
        courseCode: "COMP2396",
        year: "2024",
        status: AssignmentStatus.Ongoing,
        type: AssignmentTypes.Assignment,
        questions: [
            {
                id: "1",
                title: "Printing",
                description: "Compulsory question: learn how to print in java",
                status: QuestionStatus.Submitted,
            },
            {
                id: "2",
                title: "Classes",
                description: "Compulsory question: learn about classes in java",
                status: QuestionStatus.Ongoing,
            },
            {
                id: "3",
                title: "Object",
                description: "Compulsory question: learn about objects in java",
                status: QuestionStatus.Ongoing,
            },
            {
                id: "4",
                title: "Challenge",
                description:
                    "Optional question: Complete this question for extra marks",
                status: QuestionStatus.Ongoing,
            },
        ],
    };

    if (courseCode && year && assignmentId) {
        // try fetching, if exist return assignment page
        return <DetailedAssignmentPage {...assignmentTemplate} />;
    }

    // fall back to not found page, with a link back to course page, persist courseCode and year param, if any
    return <AssignmentNotFoundPage year={year} courseCode={courseCode} />;
}
