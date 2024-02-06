// if the attempt is not submitted, the id, created and updated time will be null.
export interface Attempt {
    id: string | null;
    userId: string;
    questionId: string;
    code: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    isSubmitted: boolean;
}
