import React from "react";
import { Tab, Card, Box } from "@mui/material";
import TestCaseTab from "./actionTabs/TestCaseTab";
import SubmissionTab from "./actionTabs/SubmissionTab";
import { useTheme } from "@mui/material/styles";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import type { CodeExecutionResult, ProgrammingLanguage } from "@schema";
import type { Attempt } from "../types/Attempt";
import type { CustomTestcase, SampleTestcase } from "../types/Testcase";
import ResultTab from "./actionTabs/ResultTab";
import UserTab from "./actionTabs/UserTab";
import { useGetSubmittedStudentsQuery } from "@/app/graphql/workspace/attempt.graphql";
import ScienceIcon from "@mui/icons-material/Science";
import PublishIcon from "@mui/icons-material/Publish";
import RuleIcon from "@mui/icons-material/Rule";
import GroupsIcon from "@mui/icons-material/Groups";

export default function ActionCard({
    activeTab,
    setActiveTab,
    isEditing,
    allowEditOrCreate,
    language,
    attemptsList,
    sampleTestcases,
    customTestcases,
    selectedTestcase,
    setSampleTestcases,
    setCustomTestcases,
    setSelectedTestcase,
    deleteCustomTestcaseFunc,
    createCustomTestcasesFunc,
    updateCustomTestcaseFunc,
    runTestcaseFunc,
    createOrUpdateAttempt,
    questionId,
    codeOnEditor,
    runTestcaseWithSampleCodeFunc,
    results,
    setCodeOnEditor,
    setOpenCodeEmptyError,
}: Readonly<{
    activeTab: string;
    setActiveTab: Function;
    isEditing: boolean;
    allowEditOrCreate: boolean;
    language: ProgrammingLanguage;
    attemptsList: Attempt[];
    sampleTestcases: SampleTestcase[];
    customTestcases: CustomTestcase[];
    selectedTestcase: SampleTestcase | CustomTestcase | undefined;
    setSampleTestcases: Function;
    setCustomTestcases: Function;
    setSelectedTestcase: Function;
    deleteCustomTestcaseFunc: Function;
    createCustomTestcasesFunc: Function;
    updateCustomTestcaseFunc: Function;
    runTestcaseFunc: Function;
    createOrUpdateAttempt: Function;
    questionId: string;
    codeOnEditor: string;
    runTestcaseWithSampleCodeFunc: Function;
    results: CodeExecutionResult[];
    setCodeOnEditor: Function;
    setOpenCodeEmptyError: React.Dispatch<React.SetStateAction<boolean>>;
}>) {
    const theme = useTheme();

    const handleTabChange = (
        event: any,
        newTab: React.SetStateAction<string>
    ) => {
        setActiveTab(newTab);
    };

    // state for student submission
    const [selectedStudent, setSelectedStudent] = React.useState<{
        id: string;
        username: string;
    }>();

    const [submittedStudents, setSubmittedStudents] = React.useState<
        { id: string; username: string }[]
    >([]);

    const [studentSubmittedAt, setStudentSubmittedAt] =
        React.useState<string>("");

    const { data: studentsData } = useGetSubmittedStudentsQuery({
        variables: { questionId: questionId },
        skip: !allowEditOrCreate || questionId === "",
        onCompleted: (data) => {
            setSubmittedStudents(
                data.submittedStudents?.map((user) => ({
                    id: user.id,
                    username: user.username,
                })) ?? []
            );
            setSelectedStudent(
                data.submittedStudents?.[0] ?? submittedStudents[0]
            );
        },
    });

    return (
        <Card
            className="h-full px-[1.8rem] py-[1.2rem]"
            sx={{ borderRadius: 6 }}
        >
            <Box className="flex flex-col h-full overflow-auto">
                <TabContext value={activeTab}>
                    <TabList
                        onChange={handleTabChange}
                        textColor="primary"
                        TabIndicatorProps={{
                            style: {
                                backgroundColor: theme.palette.primary.dark,
                                height: "0.9rem",
                            },
                        }}
                        sx={{
                            height: "50px",
                            minHeight: "50px",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        variant="scrollable"
                        scrollButtons="auto"
                        selectionFollowsFocus
                    >
                        <Tab
                            label="Test Case"
                            value="testCase"
                            icon={<ScienceIcon />}
                            iconPosition="start"
                        />
                        {/* show submission only if the user is student*/}
                        {!allowEditOrCreate && (
                            <Tab
                                label="Submission"
                                value="submission"
                                icon={<PublishIcon />}
                                iconPosition="start"
                            />
                        )}
                        <Tab
                            label="Result"
                            value="result"
                            icon={<RuleIcon />}
                            iconPosition="start"
                        />
                        {allowEditOrCreate && (
                            <Tab
                                label="Student Submissions"
                                value="user"
                                icon={<GroupsIcon />}
                                iconPosition="start"
                            />
                        )}
                    </TabList>

                    <Box className="flex-grow">
                        <TabPanel value="testCase">
                            <TestCaseTab
                                isEditing={isEditing}
                                sampleTestcases={sampleTestcases}
                                customTestcases={customTestcases}
                                selectedTestcase={selectedTestcase}
                                setSampleTestcases={setSampleTestcases}
                                setCustomTestcases={setCustomTestcases}
                                setSelectedTestcase={setSelectedTestcase}
                                deleteCustomTestcaseFunc={
                                    deleteCustomTestcaseFunc
                                }
                                createCustomTestcasesFunc={
                                    createCustomTestcasesFunc
                                }
                                updateCustomTestcaseFunc={
                                    updateCustomTestcaseFunc
                                }
                                runTestcaseFunc={runTestcaseFunc}
                                createOrUpdateAttempt={createOrUpdateAttempt}
                                questionId={questionId}
                                codeOnEditor={codeOnEditor}
                                runTestcaseWithSampleCodeFunc={
                                    runTestcaseWithSampleCodeFunc
                                }
                                setOpenCodeEmptyError={setOpenCodeEmptyError}
                            />
                        </TabPanel>
                        <TabPanel className="h-full" value="submission">
                            <SubmissionTab
                                language={language}
                                attemptsList={attemptsList}
                                setCodeOnEditor={setCodeOnEditor}
                            />
                        </TabPanel>
                        <TabPanel className="h-full" value="result">
                            <ResultTab
                                results={results}
                                allowEditOrCreate={allowEditOrCreate}
                            />
                        </TabPanel>
                        <TabPanel className="h-full" value="user">
                            <UserTab
                                questionId={questionId}
                                submittedStudents={submittedStudents}
                                selectedStudent={selectedStudent}
                                setSelectedStudent={setSelectedStudent}
                                studentSubmittedAt={studentSubmittedAt}
                                setStudentSubmittedAt={setStudentSubmittedAt}
                                setCodeOnEditor={setCodeOnEditor}
                            />
                        </TabPanel>
                    </Box>
                </TabContext>
            </Box>
        </Card>
    );
}
