"use client";

import { useSearchParams } from "next/navigation";
import DetailedAnnouncementPage from "./pages/DetailedAnnouncementPage";
import NewAnnouncementPage from "./pages/NewAnnouncementPage";
import LoadingAnnouncementPage from "./pages/LoadingAnnouncementPage";
import { useGetAnnouncementQuery } from "@/app/graphql/course/announcement.graphql";
import ErrorPage from "@/app/errors/errorPage";

export default function AnnouncementPage() {
    const searchParams = useSearchParams();

    const id = searchParams.get("id") ?? "";
    const courseId = searchParams.get("courseId") ?? "";
    const isNew = searchParams.has("new");

    // fetch admin permission
    // TODO: Check permission
    const isLecturerOrTutor = true;

    const {
        loading,
        error,
        data: announcementData,
        refetch,
    } = useGetAnnouncementQuery({
        skip: !id,
        variables: { id: id },
    });

    const announcement = announcementData?.announcement;

    const showErrorMessage =
        !loading &&
        (announcementData === undefined ||
            error ||
            announcement === undefined ||
            announcement === null);

    if (loading) {
        return <LoadingAnnouncementPage />;
    }

    // announcement exist
    if (!showErrorMessage) {
        return (
            <DetailedAnnouncementPage
                isNew={false}
                isLecturerOrTutor={isLecturerOrTutor}
                id={id}
                courseId={announcement?.course?.id ?? ""}
                courseCode={announcement?.course?.code ?? ""}
                courseName={announcement?.course?.name ?? ""}
                courseYear={announcement?.course?.year ?? ""}
                courseCreatedBy={(announcement?.course?.lecturers ?? []).map(
                    (lecturer: { username: string }) => lecturer.username
                )}
                title={announcement?.title ?? ""}
                content={announcement?.content ?? ""}
                createdBy={announcement?.createdBy.username ?? ""}
                date={announcement?.createdAt ?? ""}
                lastEdit={announcement?.updatedAt ?? ""}
                refetch={refetch}
            />
        );
    }

    // new announcement
    if (isNew && isLecturerOrTutor) {
        return <NewAnnouncementPage courseId={courseId} />;
    }

    if (isNew && !isLecturerOrTutor) {
        // if new, should check permission in new announcement page since that fetch course info, keep here for now
        return (
            <ErrorPage
                title="No permission"
                message="It appears that you do not have the necessary permissions to create an announcement for this course."
                returnMessage="Back to course page"
                returnLink="courses"
            />
        );
    }

    // fall back to not found page, with a link back to course page, persist courseId param, if any
    return (
        <ErrorPage
            title="Announcement not found"
            message="Sorry, but the announcement you are searching for is not available."
            returnLink={courseId ? `course?id=${courseId}` : "courses"}
            returnMessage="Back to course page"
        />
    );
}
