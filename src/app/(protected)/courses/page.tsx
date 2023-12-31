import { Typography, Box, Card } from "@mui/material";
import type { CourseProps } from "./types/CourseProps";
import type { LinkButtonProps } from "./types/LinkButtonProps";
import { Status, Type } from "./types/AssignmentCardProps";
import ComponentWrapper from "./components/ComponentWrapper";

import LinkIcon from "@mui/icons-material/Link";
import CampaignIcon from '@mui/icons-material/Campaign';
import AssignmentIcon from '@mui/icons-material/Assignment';

export default async function CoursesPage() {
    // need to add logic for no course selected and return, a course selection page?
    const course: CourseProps = {
        courseTitle: "COMP2396 Object-oriented Programming and Java",
        createdBy: "Wong Kenneth",
        schoolSiteLinks: [
            {
                type: "Moodle",
                description: "HKU Moodle",
                link: "http://localhost:3000/moodlefake",
            },
        ],
        annoucements: [
            {
                id: "12345",
                title: "Tutorial 2 Released",
                date: "2023-4-13 4:20pm",
                createdBy: "Wong Kenneth",
            },
            {
                id: "12346",
                title: "Tutorial 1 Released",
                date: "2023-4-13 4:20pm",
                createdBy: "Wong Kenneth",
            },
            {
                id: "12347",
                title: "Tutorial 3 Released",
                date: "2023-4-13 4:20pm",
                createdBy: "Wong Kenneth",
            },
        ],
        assignments: [
            {
                id: "12345",
                title: "Assignment 3",
                dueDate: "2023-4-20 11:59pm",
                status: Status.Ongoing,
                type: Type.Assignment,
            },
            {
                id: "12346",
                title: "Tutorial 2",
                dueDate: "2023-4-20 11:59pm",
                status: Status.Overdue,
                type: Type.Tutorial,
            },
            {
                id: "12347",
                title: "Assignment 1",
                dueDate: "2023-4-20 11:59pm",
                status: Status.Completed,
                type: Type.Assignment,
            },
        ],
    };

    return (
        <Card
            sx={{
                padding: "1.2rem 1.8rem",
                borderRadius: 6,
            }}
        >
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
                    <ComponentWrapper
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
                    />
                )}

                {course.annoucements && (
                    <ComponentWrapper
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
                    />
                )}

                {course.assignments && (
                    <ComponentWrapper
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
                    />
                )}
            </Box>
        </Card>
    );
}
