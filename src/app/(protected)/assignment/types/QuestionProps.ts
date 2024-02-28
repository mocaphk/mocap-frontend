export enum QuestionStatus {
    Submitted = 1,
    Ongoing,
}

export interface QuestionProps {
    id: string;
    title: string;
    description: string;
    status: QuestionStatus;
}
