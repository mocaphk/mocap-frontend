import React from "react";
import CardWrapper from "@/app/components/CardWrapper";
import { Box, Typography, Link as MUILink } from "@mui/material";

import type { AnnouncementProps } from "../types/AnnouncementProps";

import ReadOnlyAnnouncement from "../components/ReadOnlyAnnouncement";
import EditableAnnouncement from "../components/EditableAnnouncement";
import { useGetCourseUserRolesQuery } from "@/app/graphql/course/course.graphql";
import { UserRole } from "@schema";
import ErrorPage from "@/app/errors/errorPage";

export default function DetailedAnnouncementPage({
    isNew,
    id,
    courseId,
    courseCode,
    courseName,
    courseYear,
    courseCreatedBy,
    title,
    content,
    createdBy,
    date,
    lastEdit,
    refetch,
}: Readonly<AnnouncementProps>) {
    // check permission
    const { data: rolesData } = useGetCourseUserRolesQuery({
        skip: !courseId,
        variables: { courseId: courseId },
    });

    const roles = rolesData?.getCourseUserRoles;

    const isAdmin = roles?.includes(UserRole.Admin) ?? false;
    const isLecturer = roles?.includes(UserRole.Lecturer) ?? false;
    const isTutor = roles?.includes(UserRole.Tutor) ?? false;

    const allowCreate = isAdmin || isLecturer || isTutor;
    const allowEdit = isAdmin || isLecturer || isTutor;

    const [isEditing, setIsEditing] = React.useState(isNew);

    React.useEffect(() => {
        document.title = title;
    }, [title]);

    if (isNew && !allowCreate) {
        return (
            <ErrorPage
                title="No permission"
                message="It appears that you do not have the necessary permissions to create an announcement for this course."
                returnMessage="Back to course page"
                returnLink={`course?id=${courseId}`}
            />
        );
    }

    return (
        <CardWrapper>
            <Box className="flex flex-col mb-5">
                <Typography fontSize="1.3rem" fontWeight="medium">
                    {courseCode} {courseName} ({courseYear})
                </Typography>
                <Typography color="primary.main">
                    {courseCreatedBy.join(", ")}
                </Typography>
            </Box>

            {isEditing ? (
                <EditableAnnouncement
                    isNew={isNew}
                    id={id}
                    courseId={courseId}
                    title={title}
                    content={content}
                    setIsEditing={setIsEditing}
                    refetch={refetch}
                />
            ) : (
                <ReadOnlyAnnouncement
                    title={title}
                    content={content}
                    createdBy={createdBy}
                    date={date}
                    lastEdit={lastEdit}
                    allowEdit={allowEdit}
                    setIsEditing={setIsEditing}
                />
            )}

            <Box className="mt-7">
                <MUILink href={`course?id=${courseId}`} underline="hover">
                    « Back to course page
                </MUILink>
            </Box>
        </CardWrapper>
    );
}
