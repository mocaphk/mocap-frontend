export interface Attempt {
    id: string | undefined;
    userId: string;
    questionId: string;
    code: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    executedAt: Date | null;
    isSubmitted: boolean;
}
