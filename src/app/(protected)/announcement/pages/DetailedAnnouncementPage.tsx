import React from "react";
import CardWrapper from "@/app/components/CardWrapper";
import { Box, Typography, Link as MUILink } from "@mui/material";

import type { AnnouncementProps } from "../types/AnnouncementProps";

import ReadOnlyAnnouncement from "../components/ReadOnlyAnnouncement";
import EditableAnnouncement from "../components/EditableAnnouncement";

export default function DetailedAnnouncementPage({
    isNew,
    isLecturerOrTutor,
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
}: Readonly<AnnouncementProps>) {
    const [isEditing, setIsEditing] = React.useState(isNew);

    React.useEffect(() => {
        document.title = title;
    }, [title]);

    console.log(`see id as ${courseId} in detail`);
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
                />
            ) : (
                <ReadOnlyAnnouncement
                    title={title}
                    content={content}
                    createdBy={createdBy}
                    date={date}
                    lastEdit={lastEdit}
                    isLecturerOrTutor={isLecturerOrTutor}
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
