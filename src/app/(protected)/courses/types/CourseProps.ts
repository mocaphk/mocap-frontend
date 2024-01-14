import type { AnnouncementCardProps } from "./AnnouncementCardProps";
import type { AssignmentCardProps } from "./AssignmentCardProps";
import type { SchoolSiteLinkProps } from "./SchoolSiteLinkProps";

export interface CourseProps {
    courseTitle: string;
    createdBy: string;
    schoolSiteLinks?: Array<SchoolSiteLinkProps>;
    annoucements?: Array<AnnouncementCardProps>;
    assignments?: Array<AssignmentCardProps>;
}
