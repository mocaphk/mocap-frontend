import type { AssignmentStatus } from "@/enums/assignmentStatus";
import type { QuestionProps } from "./QuestionProps";
import type { AssignmentType } from "@schema";

export interface AssignmentProps {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    courseCode: string;
    year: string;
    status: AssignmentStatus;
    type: AssignmentType;
    questions: Array<QuestionProps>;
}
