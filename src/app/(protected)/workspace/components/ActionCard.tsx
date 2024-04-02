import React from "react";
import { Tab, Card, Box } from "@mui/material";
import TestCaseTab from "./tabs/TestCaseTab";
import SubmissionTab from "./tabs/SubmissionTab";
import { useTheme } from "@mui/material/styles";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ScienceIcon from "@mui/icons-material/Science";
import PublishIcon from "@mui/icons-material/Publish";

export default function ActionCard({
    language,
}: Readonly<{ language: string }>) {
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
                        <Tab
                            label="Submission"
                            value="submission"
                            icon={<PublishIcon />}
                            iconPosition="start"
                        />
                    </TabList>

                    <Box className="flex-grow">
                        <TabPanel value="testCase">
                            <TestCaseTab />
                        </TabPanel>
                        <TabPanel className="h-full" value="submission">
                            <SubmissionTab language={language} />
                        </TabPanel>
                    </Box>
                </TabContext>
            </Box>
        </Card>
    );
}
