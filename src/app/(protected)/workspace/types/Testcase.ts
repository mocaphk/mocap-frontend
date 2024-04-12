export interface TestcaseInputEntry {
    name: string;
    value: string;
}

export interface CustomTestcase {
    tempId: string;
    id: string;
    input: TestcaseInputEntry[];
    expectedOutput: string;
    output: string;
    isTimeout: boolean;
}

export interface SampleTestcase {
    tempId: string;
    id: string;
    input: TestcaseInputEntry[];
    expectedOutput: string;
    isHidden: boolean;
    output: string;
    isTimeout: boolean;
}
