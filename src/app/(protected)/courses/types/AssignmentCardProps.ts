import type { AssignmentStatus } from "@/enums/assignmentStatus";
import type { AssignmentTypes } from "@/enums/assignmentTypes";

export interface AssignmentCardProps {
    id: string;
    title: string;
    dueDate: string;
    status: AssignmentStatus;
    type: AssignmentTypes;
}
