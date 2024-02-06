import type { TestCase } from "./TestCase";

export interface Question {
    id: string;
    title: string;
    description: string;
    sampleCode: string;
    assignmentId: string;
    language: string;
    testCases: Array<TestCase>;
}
