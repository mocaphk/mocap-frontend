"use client";

import React from "react";
import { Box, Dialog, Button, Typography } from "@mui/material";
import type { SvgIconTypeMap } from "@mui/material";
import CardWrapper from "@/app/components/CardWrapper";
import CollapsibleComponentWrapper from "./components/CollapsibleComponentWrapper";
import ManageUserForm from "./components/ManageUserForm";
import NewLinkForm from "./components/NewLinkForm";
import NewAssignmentForm from "./components/NewAssignmentForm";

import type { LinkButtonProps } from "@/app/types/LinkButtonProps";

import LinkIcon from "@mui/icons-material/Link";
import CampaignIcon from "@mui/icons-material/Campaign";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionSharpIcon from "@mui/icons-material/DescriptionSharp";
import SchoolIcon from "@mui/icons-material/School";
import AddIcon from "@mui/icons-material/Add";
import PeopleIcon from "@mui/icons-material/People";
import DoneIcon from "@mui/icons-material/Done";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import CloseIcon from "@mui/icons-material/Close";

import {
    useGetCourseQuery,
    useGetCourseUserRolesQuery,
} from "@/app/graphql/course/course.graphql";
import { useSearchParams } from "next/navigation";
import CustomSkeleton from "@/app/components/CustomSkeleton";
import { AssignmentType, UserRole } from "@schema";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import Link from "next/link";
import { AssignmentStatus } from "@/enums/assignmentStatus";
import dayjs from "dayjs";
import ErrorPage from "@/app/errors/errorPage";

export default function CoursePage() {
    const searchParams = useSearchParams();

    const id = searchParams.get("id") ?? "";

    const {
        loading,
        error,
        data: courseData,
        refetch,
    } = useGetCourseQuery({
        skip: !id,
        variables: { courseId: id },
    });

    const { data: rolesData } = useGetCourseUserRolesQuery({
        skip: !id,
        variables: { courseId: id },
    });

    const roles = rolesData?.getCourseUserRoles;
    const course = courseData?.course;

    const isAdmin = roles?.includes(UserRole.Admin) ?? false;
    const isLecturer = roles?.includes(UserRole.Lecturer) ?? false;
    const isTutor = roles?.includes(UserRole.Tutor) ?? false;

    const showErrorMessage =
        !loading &&
        (courseData === undefined ||
            error ||
            course === undefined ||
            course === null);

    const assignmentTypeIconMap: Record<
        AssignmentType,
        OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string }
    > = {
        [AssignmentType.Assignment]: DescriptionSharpIcon,
        [AssignmentType.Tutorial]: SchoolIcon,
    };

    // TODO: Add status
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

    // manage student form
    const [openManageUserFormPopup, setOpenManageUserFormPopup] =
        React.useState(false);

    // new link form
    const [openLinkPopup, setOpenLinkPopup] = React.useState(false);

    // new assignment form
    const [openAssignmentPopup, setOpenAssignmentPopup] = React.useState(false);

    React.useEffect(() => {
        document.title = course?.name ?? "Course";
    }, [course?.name]);

    if (showErrorMessage) {
        return (
            <ErrorPage
                title="Course not found"
                message="Sorry, but the course you are searching for is not available."
                returnLink="courses"
                returnMessage="Back to course page"
            />
        );
    }

    return (
        <CardWrapper>
            <Box className="flex flex-row w-full items-start justify-between">
                <Box className="flex flex-col mb-5">
                    {loading ? (
                        <>
                            <CustomSkeleton width={500} />
                            <CustomSkeleton width={200} />
                        </>
                    ) : (
                        <>
                            <Typography fontSize="1.3rem" fontWeight="medium">
                                {course?.code} {course?.name} ({course?.year})
                            </Typography>
                            <Typography color="primary.main">
                                {course?.lecturers
                                    .map((lecturer) => lecturer.username)
                                    .join(", ")}
                            </Typography>
                        </>
                    )}
                </Box>
                {isAdmin && (
                    <Button
                        variant="outlined"
                        sx={{
                            borderRadius: 5,
                            textTransform: "none",
                            fontSize: 16,
                        }}
                        startIcon={<PeopleIcon />}
                        onClick={() => setOpenManageUserFormPopup(true)}
                    >
                        Manage Student
                    </Button>
                )}
            </Box>

            <Box className="flex flex-col gap-7">
                <CollapsibleComponentWrapper
                    Icon={LinkIcon}
                    title="Links"
                    linkButtonsProps={course?.externalLinks.map<LinkButtonProps>(
                        (link) => ({
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            Icon: LinkIcon,
                            title: link.title,
                            description: link.description,
                            link: link.link,
                        })
                    )}
                    displayAmount={3}
                    actionButton={
                        (isAdmin || isLecturer || isTutor) && (
                            <Button
                                variant="outlined"
                                sx={{
                                    borderRadius: 5,
                                    textTransform: "none",
                                    fontSize: 16,
                                }}
                                startIcon={<AddIcon />}
                                onClick={() => setOpenLinkPopup(true)}
                            >
                                New Link
                            </Button>
                        )
                    }
                    loading={loading}
                />

                <CollapsibleComponentWrapper
                    Icon={CampaignIcon}
                    title="Announcements"
                    linkButtonsProps={course?.announcements.map<LinkButtonProps>(
                        (announcement) => ({
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            Icon: CampaignIcon,
                            title: announcement.title,
                            description: announcement.createdAt,
                            createdBy: announcement.createdBy.username,
                            link: `announcement?id=${announcement.id}&courseId=${id}`,
                        })
                    )}
                    displayAmount={2}
                    actionButton={
                        (isAdmin || isLecturer || isTutor) && (
                            <Link
                                href={`announcement?id=&courseId=${id}&new`}
                                className="rounded-2xl"
                            >
                                <Button
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 5,
                                        textTransform: "none",
                                        fontSize: 16,
                                    }}
                                    startIcon={<AddIcon />}
                                >
                                    New Announcement
                                </Button>
                            </Link>
                        )
                    }
                    loading={loading}
                />

                <CollapsibleComponentWrapper
                    Icon={AssignmentIcon}
                    title="Assignments"
                    linkButtonsProps={course?.assignments?.map<LinkButtonProps>(
                        (assignment) => {
                            const { questions, dateDue } = assignment;
                            const isCompleted = questions.every((question) =>
                                question.attempts.some(
                                    (attempt) => attempt.isSubmitted
                                )
                            );
                            const status: AssignmentStatus = isCompleted
                                ? AssignmentStatus.Completed
                                : dayjs().isAfter(dayjs(dateDue))
                                ? AssignmentStatus.Overdue
                                : AssignmentStatus.Ongoing;
                            return {
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                Icon: assignmentTypeIconMap[assignment.type],
                                title: assignment.title,
                                description: assignment.dateDue,
                                statusIcon: statusIconMap[status],
                                link: `assignment?id=${assignment.id}`,
                            };
                        }
                    )}
                    displayAmount={3}
                    actionButton={
                        (isAdmin || isLecturer || isTutor) && (
                            <Button
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
                        )
                    }
                    loading={loading}
                />
            </Box>

            <Dialog
                onClose={() => setOpenManageUserFormPopup(false)}
                open={openManageUserFormPopup}
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <ManageUserForm courseId={id} />
            </Dialog>

            <Dialog
                onClose={() => setOpenLinkPopup(false)}
                open={openLinkPopup}
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <NewLinkForm
                    courseId={id}
                    refetch={refetch}
                    closeForm={() => setOpenLinkPopup(false)}
                />
            </Dialog>

            <Dialog
                onClose={() => setOpenAssignmentPopup(false)}
                open={openAssignmentPopup}
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <NewAssignmentForm courseId={id} />
            </Dialog>
        </CardWrapper>
    );
}
