import type { AssignmentStatus } from "@/enums/assignmentStatus";
import type { AssignmentTypes } from "@/enums/assignmentTypes";
import type { QuestionProps } from "./QuestionProps";

export interface AssignmentProps {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    courseCode: string;
    year: string;
    status: AssignmentStatus;
    type: AssignmentTypes;
    questions: Array<QuestionProps>;
}
