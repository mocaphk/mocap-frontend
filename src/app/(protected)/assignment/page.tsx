"use client";

import { useSearchParams } from "next/navigation";
import DetailedAssignmentPage from "./pages/DetailedAssignmentPage";
import {
    useGetAssignmentQuery,
    useGetAssignmentUserRolesQuery,
} from "@/app/graphql/course/assignment.graphql";
import LoadingAssignmentPage from "./pages/LoadingAssignmentPage";
import ErrorPage from "@/app/errors/errorPage";
import { UserRole } from "@schema";

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

    const { data: rolesData } = useGetAssignmentUserRolesQuery({
        skip: !id,
        variables: { assignmentId: id },
    });

    const roles = rolesData?.getAssignmentUserRoles;

    const isAdmin = roles?.includes(UserRole.Admin) ?? false;
    const isLecturer = roles?.includes(UserRole.Lecturer) ?? false;
    const isTutor = roles?.includes(UserRole.Tutor) ?? false;

    const allowCreateQuestion = isAdmin || isLecturer || isTutor;

    if (loading) {
        return <LoadingAssignmentPage />;
    }

    if (!showErrorMessage) {
        return (
            <DetailedAssignmentPage
                allowCreateQuestion={allowCreateQuestion}
                assignment={assignment}
            />
        );
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
