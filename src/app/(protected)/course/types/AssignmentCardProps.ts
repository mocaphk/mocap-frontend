import type { AssignmentStatus } from "@/enums/assignmentStatus";
import type { AssignmentType } from "@schema";

export interface AssignmentCardProps {
    id: string;
    title: string;
    dueDate: string;
    status: AssignmentStatus;
    type: AssignmentType;
}
