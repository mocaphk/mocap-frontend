import type { SampleTestcase } from "./Testcase";
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
    testcases: Array<SampleTestcase>;
    codingEnvironmentId: string | null | undefined;
    isPublic: boolean;
}
