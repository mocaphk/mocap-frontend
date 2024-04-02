"use client";

import React from "react";
import { Box, Dialog, Button, Typography } from "@mui/material";
import type { SvgIconTypeMap } from "@mui/material";
import CardWrapper from "@/app/components/CardWrapper";
import CollapsibleComponentWrapper from "./components/CollapsibleComponentWrapper";
import NewAssignmentForm from "./components/NewAssignmentForm";

import type { LinkButtonProps } from "@/app/types/LinkButtonProps";

import LinkIcon from "@mui/icons-material/Link";
import CampaignIcon from "@mui/icons-material/Campaign";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionSharpIcon from "@mui/icons-material/DescriptionSharp";
import SchoolIcon from "@mui/icons-material/School";
import AddIcon from "@mui/icons-material/Add";
import PeopleIcon from "@mui/icons-material/People";
import ManageStudentForm from "./components/ManageStudentForm";
import { useGetCourseQuery } from "@/app/graphql/course/course.graphql";
import { useSearchParams } from "next/navigation";
import NoResult from "@/app/errors/noResult";
import CustomSkeleton from "@/app/components/CustomSkeleton";
import { AssignmentType } from "@schema";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

export default function CoursePage() {
    // fetch admin permission
    // TODO: Check permission
    const isLecturerOrTutor = true;

    const searchParams = useSearchParams();

    const id = searchParams.get("id") ?? "";

    const {
        loading,
        error,
        data: courseData,
    } = useGetCourseQuery({
        skip: !id,
        variables: { courseId: id },
    });

    const course = courseData?.course;

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
    // const statusIconMap = {
    //     [AssignmentStatus.Completed]: {
    //         icon: DoneIcon,
    //         color: "lime",
    //     },
    //     [AssignmentStatus.Ongoing]: {
    //         icon: TripOriginIcon,
    //         color: "#ffcc00",
    //     },
    //     [AssignmentStatus.Overdue]: {
    //         icon: CloseIcon,
    //         color: "red",
    //     },
    // };

    const [openAssignmentPopup, setOpenAssignmentPopup] = React.useState(false);

    // manage student form
    const [openManageStudentFormPopup, setOpenManageStudentFormPopup] =
        React.useState(false);

    React.useEffect(() => {
        document.title = course?.name ?? "Course";
    }, [course?.name]);

    return (
        <CardWrapper>
            {showErrorMessage ? (
                <NoResult
                    redirectTo="/courses"
                    redirectToText="Back to courses page"
                />
            ) : (
                <>
                    <Box className="flex flex-row w-full items-start justify-between">
                        <Box className="flex flex-col mb-5">
                            {loading ? (
                                <>
                                    <CustomSkeleton width={500} />
                                    <CustomSkeleton width={200} />
                                </>
                            ) : (
                                <>
                                    <Typography
                                        fontSize="1.3rem"
                                        fontWeight="medium"
                                    >
                                        {course?.code} {course?.name} (
                                        {course?.year})
                                    </Typography>
                                    <Typography color="primary.main">
                                        {course?.lecturers
                                            .map(
                                                (lecturer) => lecturer.username
                                            )
                                            .join(", ")}
                                    </Typography>
                                </>
                            )}
                        </Box>
                        {isLecturerOrTutor && (
                            <Button
                                variant="outlined"
                                sx={{
                                    borderRadius: 5,
                                    textTransform: "none",
                                    fontSize: 16,
                                }}
                                startIcon={<PeopleIcon />}
                                onClick={() =>
                                    setOpenManageStudentFormPopup(true)
                                }
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
                                    link: `announcement?id=${announcement.id}`,
                                })
                            )}
                            displayAmount={2}
                            loading={loading}
                        />

                        <CollapsibleComponentWrapper
                            Icon={AssignmentIcon}
                            title="Assignments"
                            linkButtonsProps={course?.assignments?.map<LinkButtonProps>(
                                (assignment) => ({
                                    // eslint-disable-next-line @typescript-eslint/naming-convention
                                    Icon: assignmentTypeIconMap[
                                        assignment.type
                                    ],
                                    title: assignment.title,
                                    description: assignment.dateDue,
                                    // statusIcon: statusIconMap[assignment.status],
                                    link: `assignment?id=${assignment.id}`,
                                })
                            )}
                            displayAmount={3}
                            actionButton={
                                isLecturerOrTutor && (
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 5,
                                            textTransform: "none",
                                            fontSize: 16,
                                        }}
                                        startIcon={<AddIcon />}
                                        onClick={() =>
                                            setOpenAssignmentPopup(true)
                                        }
                                    >
                                        New Assignment
                                    </Button>
                                )
                            }
                            loading={loading}
                        />
                    </Box>

                    <Dialog
                        onClose={() => setOpenAssignmentPopup(false)}
                        open={openAssignmentPopup}
                        PaperProps={{ sx: { borderRadius: 3 } }}
                    >
                        <NewAssignmentForm courseId={id} />
                    </Dialog>

                    <Dialog
                        onClose={() => setOpenManageStudentFormPopup(false)}
                        open={openManageStudentFormPopup}
                        PaperProps={{ sx: { borderRadius: 3 } }}
                    >
                        <ManageStudentForm />
                    </Dialog>
                </>
            )}
        </CardWrapper>
    );
}
