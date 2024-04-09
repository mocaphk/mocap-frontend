import type { GetAnnouncementQuery } from "@/app/graphql/course/announcement.graphql";
import type { QueryResult } from "@apollo/client";

export interface AnnouncementProps {
    isNew: boolean;
    isLecturerOrTutor: boolean;
    id: string;
    courseId: string;
    courseCode: string;
    courseName: string;
    courseYear: string;
    courseCreatedBy: Array<string>;
    title: string;
    content: string;
    createdBy: string;
    date: string;
    lastEdit: string;
    refetch: QueryResult<GetAnnouncementQuery>["refetch"];
}
