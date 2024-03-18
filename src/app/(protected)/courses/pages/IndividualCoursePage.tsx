"use client";

import React from "react";
import { Typography, Box, Dialog, Button } from "@mui/material";

import CardWrapper from "@/app/components/CardWrapper";
import CollapsibleComponentWrapper from "../components/CollapsibleComponentWrapper";
import NewAssignmentForm from "../components/NewAssignmentForm";

import type { CourseProps } from "../types/CourseProps";
import type { LinkButtonProps } from "@/app/types/LinkButtonProps";
import type { NewAssignmentProps } from "../types/NewAssignmentProps";
import { AssignmentTypes } from "@/enums/assignmentTypes";
import { AssignmentStatus } from "@/enums/assignmentStatus";

import LinkIcon from "@mui/icons-material/Link";
import CampaignIcon from "@mui/icons-material/Campaign";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionSharpIcon from "@mui/icons-material/DescriptionSharp";
import SchoolIcon from "@mui/icons-material/School";
import DoneIcon from "@mui/icons-material/Done";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

export default function IndividualCoursePage({
    year,
    courseCode,
    courseTitle,
    createdBy,
    schoolSiteLinks,
    annoucements,
    assignments,
}: Readonly<CourseProps>) {
    const assignmentTypeIconMap = {
        [AssignmentTypes.Assignment]: DescriptionSharpIcon,
        [AssignmentTypes.Tutorial]: SchoolIcon,
    };

    const statusIconMap = {
        [AssignmentStatus.Completed]: {
            icon: DoneIcon,
            color: "lime",
        },
        [AssignmentStatus.Ongoing]: {
            icon: TripOriginIcon,
            color: "#ffcc00",
        },
        [AssignmentStatus.Overdue]: {
            icon: CloseIcon,
            color: "red",
        },
    };

    const currentDate = new Date().toLocaleDateString("en-CA");
    const [openAssignmentPopup, setOpenAssignmentPopup] = React.useState(false);
    const [newAssignmentInfo, setNewAssignmentInfo] =
        React.useState<NewAssignmentProps>({
            courseCode: courseCode,
            assignmentTitle: "",
            assignmentShortDescription: "",
            openDate: currentDate,
            dueDate: currentDate,
            closeDate: currentDate,
        });

    const handleAssignmentFormChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const name = event.target.name;
        const value = event.target.value;
        setNewAssignmentInfo((values) => ({ ...values, [name]: value }));
    };

    React.useEffect(() => {
        document.title = courseTitle;
    }, [courseTitle]);

    return (
        <CardWrapper>
            <Box className="flex flex-col mb-5">
                <Typography fontSize="1.3rem" fontWeight="medium">
                    {courseTitle}
                </Typography>
                <Typography color="secondary.main">{createdBy}</Typography>
            </Box>

            <Box className="flex flex-col gap-7">
                {schoolSiteLinks && (
                    <CollapsibleComponentWrapper
                        Icon={LinkIcon}
                        title="Links"
                        linkButtonsProps={schoolSiteLinks?.map<LinkButtonProps>(
                            (link) => ({
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                Icon: LinkIcon,
                                title: link.type,
                                description: link.description,
                                link: link.link,
                            })
                        )}
                        displayAmount={3}
                    />
                )}

                {annoucements && (
                    <CollapsibleComponentWrapper
                        Icon={CampaignIcon}
                        title="Annoucements"
                        linkButtonsProps={annoucements?.map<LinkButtonProps>(
                            (annoucement) => ({
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                Icon: CampaignIcon,
                                title: annoucement.title,
                                description: annoucement.date,
                                createdBy: annoucement.createdBy,
                                link: `announcements/${annoucement.id}`,
                            })
                        )}
                        displayAmount={2}
                    />
                )}

                {assignments && (
                    <CollapsibleComponentWrapper
                        Icon={AssignmentIcon}
                        title="Assignments"
                        linkButtonsProps={assignments?.map<LinkButtonProps>(
                            (assignment) => ({
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                Icon: assignmentTypeIconMap[assignment.type],
                                title: assignment.title,
                                description: assignment.dueDate,
                                statusIcon: statusIconMap[assignment.status],
                                link: `assignment?courseCode=${courseCode}&year=${year}&assignmentId=${assignment.id}`,
                            })
                        )}
                        displayAmount={3}
                        actionButton={
                            <Button
                                color="secondary"
                                variant="outlined"
                                sx={{
                                    borderRadius: 5,
                                    textTransform: "none",
                                    fontSize: 16,
                                }}
                                startIcon={<AddIcon />}
                                onClick={() => setOpenAssignmentPopup(true)}
                            >
                                New Assignment
                            </Button>
                        }
                    />
                )}
            </Box>

            <Dialog
                onClose={() => setOpenAssignmentPopup(false)}
                open={openAssignmentPopup}
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <NewAssignmentForm
                    form={newAssignmentInfo}
                    handleChange={handleAssignmentFormChange}
                />
            </Dialog>
        </CardWrapper>
    );
}
