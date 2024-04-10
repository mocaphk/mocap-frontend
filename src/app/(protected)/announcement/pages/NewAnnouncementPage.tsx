import { useGetCourseTitleQuery } from "@/app/graphql/course/course.graphql";
import DetailedAnnouncementPage from "./DetailedAnnouncementPage";
import LoadingAnnouncementPage from "./LoadingAnnouncementPage";
import ErrorPage from "@/app/errors/errorPage";

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

    return (
        <ErrorPage
            title="Course not found"
            message="It appears that the course you intended to link the announcement to does not exist."
            returnMessage="Back to course page"
            returnLink="/courses"
        />
    );
}
