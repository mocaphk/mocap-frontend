import type { GetAnnouncementQuery } from "@/app/graphql/course/announcement.graphql";
import type { QueryResult } from "@apollo/client";

export interface EditableAnnouncementProps {
    isNew: boolean;
    id: string;
    courseId: string;
    title: string;
    content: string;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    refetch: QueryResult<GetAnnouncementQuery>["refetch"];
}
