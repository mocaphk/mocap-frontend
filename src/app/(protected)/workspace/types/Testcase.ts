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
}

export interface SampleTestcase {
    tempId: string;
    id: string;
    input: TestcaseInputEntry[];
    expectedOutput: string;
    isHidden: boolean;
    output: string;
}

export interface CreateOrUpdateTestcaseInput {
    input: TestcaseInputEntry[];
    expectedOutput: string;
    isHidden: boolean;
}

export interface CreateOrUpdateCustomTestcaseInput {
    input: TestcaseInputEntry[];
}
