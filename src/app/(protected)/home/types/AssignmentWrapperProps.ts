import type { AssignmentCardProps } from "./AssignmentCardProps";

export interface AssignmentWrapperProps {
    dueDate: string;
    assignments: Array<AssignmentCardProps>;
}
