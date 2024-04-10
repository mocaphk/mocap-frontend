"use client";

import { useSearchParams } from "next/navigation";
import DetailedAssignmentPage from "./pages/DetailedAssignmentPage";
import { useGetAssignmentQuery } from "@/app/graphql/course/assignment.graphql";
import LoadingAssignmentPage from "./pages/LoadingAssignmentPage";
import ErrorPage from "@/app/errors/errorPage";

export default function AssignmentPage() {
    const searchParams = useSearchParams();

    const id = searchParams.get("id") ?? "";

    const {
        loading,
        error,
        data: assignmentData,
    } = useGetAssignmentQuery({
        skip: !id,
        variables: { assignmentId: id },
    });

    const assignment = assignmentData?.assignment;

    const showErrorMessage =
        assignmentData === undefined ||
        error ||
        assignment === undefined ||
        assignment === null;

    if (loading) {
        return <LoadingAssignmentPage />;
    }

    if (!showErrorMessage) {
        return <DetailedAssignmentPage assignment={assignment} />;
    }

    return (
        <ErrorPage
            title="Assignment not found"
            message="Sorry, but the assignment you are searching for is not available."
            returnLink={
                assignment?.course.id
                    ? `course?id=${assignment?.course.id}`
                    : "courses"
            }
            returnMessage="Back to course page"
        />
    );
}
