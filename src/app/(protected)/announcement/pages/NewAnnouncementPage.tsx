import { useGetCourseTitleQuery } from "@/app/graphql/course/course.graphql";
import DetailedAnnouncementPage from "./DetailedAnnouncementPage";
import AnnouncementNotFoundPage from "./AnnouncementNotFoundPage";
import LoadingAnnouncementPage from "./LoadingAnnouncementPage";

export default function NewAnnouncementPage({
    courseId,
}: Readonly<{
    courseId: string;
}>) {
    const {
        loading,
        error,
        data: courseData,
        refetch,
    } = useGetCourseTitleQuery({
        skip: !courseId,
        variables: { courseId: courseId },
    });

    const course = courseData?.course;

    const showErrorMessage =
        !loading &&
        (courseData === undefined ||
            error ||
            course === undefined ||
            course === null);

    if (loading) {
        return <LoadingAnnouncementPage />;
    }

    if (!showErrorMessage) {
        return (
            <DetailedAnnouncementPage
                isNew={true}
                isLecturerOrTutor={true}
                id={""}
                courseId={course?.id ?? ""}
                courseCode={course?.code ?? ""}
                courseName={course?.name ?? ""}
                courseYear={course?.year ?? ""}
                courseCreatedBy={(course?.lecturers ?? []).map(
                    (lecturer) => lecturer.username
                )}
                title={""}
                content={""}
                createdBy={""}
                date={""}
                lastEdit={""}
                refetch={refetch}
            />
        );
    }

    // fall back to not found page, with a link back to course page, persist courseId param, if any
    return <AnnouncementNotFoundPage courseId={courseId} />;
}
