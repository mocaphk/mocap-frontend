export enum Status {
    Completed = 1,
    Ongoing,
    Overdue,
}

export enum Type {
    Tutorial = 1,
    Assignment,
}

export interface AssignmentCardProps {
    id: string;
    title: string;
    dueDate: string;
    status: Status;
    type: Type;
}
