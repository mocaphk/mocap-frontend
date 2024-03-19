"use client";

import { useSearchParams } from "next/navigation";
import AnnouncementNotFoundPage from "./pages/AnnouncementNotFoundPage";
import DetailedAnnouncementPage from "./pages/DetailedAnnouncementPage";
import type { AnnouncementProps } from "./types/AnnouncementProps";

export default function AnnouncementPage() {
    const searchParams = useSearchParams();

    const year = searchParams.get("year");
    const courseCode = searchParams.get("courseCode");
    const announcementId = searchParams.get("announcementId");

    const announcementTemplate: AnnouncementProps = {
        id: "1",
        courseCode: "COMP2396",
        courseTitle: "COMP2396 Object-oriented Programming and Java",
        year: "2024",
        title: "Introduction",
        content:
            "Welcome to the exciting world of Java programming! In this course, you will dive into the fundamentals of Java, a versatile and powerful programming language used in a wide range of applications. From basic syntax to advanced concepts, you will learn how to design and develop robust software solutions. Get ready to explore object-oriented programming, data structures, algorithms, and more. Whether you are a beginner or looking to enhance your skills, this course will equip you with the knowledge and tools to succeed in the dynamic field of software development. Let's embark on this journey together and unleash your potential in Java programming!",
        createdBy: "Wong Kenneth",
        date: "Friday, 14 October 2022, 1:22 PM",
        lastEdit: "Friday, 14 October 2022, 2:22 PM",
    };

    if (courseCode && year && announcementId) {
        // try fetching, if exist return announcement page
        return <DetailedAnnouncementPage {...announcementTemplate} />;
    }

    // fall back to not found page, with a link back to course page, persist courseCode and year param, if any
    return <AnnouncementNotFoundPage year={year} courseCode={courseCode} />;
}
