export interface TestCase {
    id: string;
    questionId: string;
    variables: Record<string, number | string | null>;
    providedByTeacher: boolean;
}
