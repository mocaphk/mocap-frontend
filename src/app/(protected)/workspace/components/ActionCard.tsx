import React from "react";
import { Tab, Card, Box } from "@mui/material";
import TestCaseTab from "./actionTabs/TestCaseTab";
import SubmissionTab from "./actionTabs/SubmissionTab";
import { useTheme } from "@mui/material/styles";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ScienceIcon from "@mui/icons-material/Science";
import PublishIcon from "@mui/icons-material/Publish";
import type { ProgrammingLanguage } from "@schema";
import type { Attempt } from "../types/Attempt";
import type { CustomTestcase, SampleTestcase } from "../types/Testcase";

export default function ActionCard({
    isEditing,
    allowEditOrCreate,
    language,
    attemptsList,
    setCurrentAttempt,
    sampleTestcases,
    customTestcases,
    selectedTestcase,
    setSampleTestcases,
    setCustomTestcases,
    setSelectedTestcase,
    deleteSampleTestcaseFunc,
    deleteCustomTestcaseFunc,
    createSampleTestcasesFunc,
    updateSampleTestcaseFunc,
    createCustomTestcasesFunc,
    updateCustomTestcaseFunc,
    runTestcaseFunc,
    createOrUpdateAttempt,
    questionId,
    codeOnEditor,
    runTestcaseWithSampleCodeFunc,
}: Readonly<{
    isEditing: boolean;
    allowEditOrCreate: boolean;
    language: ProgrammingLanguage;
    attemptsList: Attempt[];
    setCurrentAttempt: Function;
    sampleTestcases: SampleTestcase[];
    customTestcases: CustomTestcase[];
    selectedTestcase: SampleTestcase | CustomTestcase | undefined;
    setSampleTestcases: Function;
    setCustomTestcases: Function;
    setSelectedTestcase: Function;
    deleteSampleTestcaseFunc: Function;
    deleteCustomTestcaseFunc: Function;
    createSampleTestcasesFunc: Function;
    updateSampleTestcaseFunc: Function;
    createCustomTestcasesFunc: Function;
    updateCustomTestcaseFunc: Function;
    runTestcaseFunc: Function;
    createOrUpdateAttempt: Function;
    questionId: string;
    codeOnEditor: string;
    runTestcaseWithSampleCodeFunc: Function;
}>) {
    const [activeTab, setActiveTab] = React.useState("testCase");
    const theme = useTheme();

    const handleTabChange = (
        event: any,
        newTab: React.SetStateAction<string>
    ) => {
        setActiveTab(newTab);
    };

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
                                deleteSampleTestcaseFunc={
                                    deleteSampleTestcaseFunc
                                }
                                deleteCustomTestcaseFunc={
                                    deleteCustomTestcaseFunc
                                }
                                createSampleTestcasesFunc={
                                    createSampleTestcasesFunc
                                }
                                updateSampleTestcaseFunc={
                                    updateSampleTestcaseFunc
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
                            />
                        </TabPanel>
                        <TabPanel className="h-full" value="submission">
                            <SubmissionTab
                                language={language}
                                attemptsList={attemptsList}
                                setCurrentAttempt={setCurrentAttempt}
                            />
                        </TabPanel>
                    </Box>
                </TabContext>
            </Box>
        </Card>
    );
}
