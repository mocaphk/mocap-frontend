"use client";

import { Typography, Box } from "@mui/material";
import type { CourseProps } from "../types/CourseProps";
import type { LinkButtonProps } from "../types/LinkButtonProps";
import CardWrapper from "@/app/components/CardWrapper";
import CollapsibleComponentWrapper from "../components/CollapsibleComponentWrapper";

import LinkIcon from "@mui/icons-material/Link";
import CampaignIcon from "@mui/icons-material/Campaign";
import AssignmentIcon from "@mui/icons-material/Assignment";
import React from "react";

export default function IndividualCoursePage({
    course,
}: Readonly<{
    course: CourseProps;
}>) {
    React.useEffect(() => {
        document.title = course.courseTitle;
    }, [course]);

    return (
        <CardWrapper>
            <Box className="flex flex-col mb-5">
                <Typography fontSize="1.3rem" fontWeight="medium">
                    {course.courseTitle}
                </Typography>
                <Typography color="secondary.main">
                    {course.createdBy}
                </Typography>
            </Box>

            <Box className="flex flex-col gap-7">
                {course.schoolSiteLinks && (
                    <CollapsibleComponentWrapper
                        Icon={LinkIcon}
                        title="Links"
                        linkButtonsProps={course.schoolSiteLinks?.map<LinkButtonProps>(
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

                {course.annoucements && (
                    <CollapsibleComponentWrapper
                        Icon={CampaignIcon}
                        title="Annoucements"
                        linkButtonsProps={course.annoucements?.map<LinkButtonProps>(
                            (annoucement) => ({
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                Icon: CampaignIcon,
                                title: annoucement.title,
                                description: annoucement.date,
                                createdBy: annoucement.createdBy,
                                path: `announcements/${annoucement.id}`,
                            })
                        )}
                        displayAmount={2}
                    />
                )}

                {course.assignments && (
                    <CollapsibleComponentWrapper
                        Icon={AssignmentIcon}
                        title="Assignments"
                        linkButtonsProps={course.assignments?.map<LinkButtonProps>(
                            (assignment) => ({
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                title: assignment.title,
                                description: assignment.dueDate,
                                assignmentType: assignment.type,
                                status: assignment.status,
                                path: `workspace/${assignment.id}`,
                            })
                        )}
                        displayAmount={3}
                    />
                )}
            </Box>
        </CardWrapper>
    );
}
