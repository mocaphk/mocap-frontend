import type { CheckingMethod, ProgrammingLanguage } from "@schema";

export interface Question {
    assignmentId: string;
    id: string;
    title: string;
    description: string;
    language: ProgrammingLanguage;
    sampleCode: string;
    checkingMethod: CheckingMethod;
    execCommand: string;
    timeLimit: number;
    codingEnvironmentId: string | null | undefined;
    isPublic: boolean;
}
