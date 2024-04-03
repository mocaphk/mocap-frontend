"use client";

import { useSearchParams } from "next/navigation";
import AssignmentNotFoundPage from "./pages/AssignmentNotFoundPage";
import DetailedAssignmentPage from "./pages/DetailedAssignmentPage";
import { useGetAssignmentQuery } from "@/app/graphql/course/assignment.graphql";
import LoadingAssignmentPage from "./pages/LoadingAssignmentPage";

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

    return <AssignmentNotFoundPage courseId={assignment?.course.id} />;
}
