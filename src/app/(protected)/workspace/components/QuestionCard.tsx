import React, { useEffect, useState } from "react";
import type { Question } from "../types/Question";
import { Box, Link as MUILink } from "@mui/material";
import { useRouter } from "next/navigation";
import { useGetCodingEnvironmentByAssignmentIdQuery } from "../../../graphql/workspace/codingEnvironment.graphql";
import CardWrapper from "@/app/components/CardWrapper";
import EditQuestionTab from "./questionTabs/editQuestionTab";
import QuestionTab from "./questionTabs/questionTab";
import type { SampleTestcase, CustomTestcase } from "../types/Testcase";

export default function QuestionCard({
    assignmentId,
    question,
    isEditing,
    setIsEditing,
    allowEditOrCreate,
    editedQuestion,
    setEditedQuestion,
    onDeleteQuestion,
    onSaveQuestion,
    sampleTestcases,
    customTestcases,
    setSelectedTestcase,
}: Readonly<{
    assignmentId: string;
    question: Question;
    isEditing: boolean;
    setIsEditing: Function;
    allowEditOrCreate: boolean;
    editedQuestion: Question;
    setEditedQuestion: Function;
    onDeleteQuestion: Function;
    onSaveQuestion: Function;
    sampleTestcases: SampleTestcase[];
    customTestcases: CustomTestcase[];
    setSelectedTestcase: Function;
}>) {
    const router = useRouter();

    const [codingEnvironments, setCodingEnvironments] = useState<
        { id: number; name: string }[]
    >([]);

    const { data, error } = useGetCodingEnvironmentByAssignmentIdQuery({
        variables: { assignmentId: assignmentId },
        skip: !isEditing,
    });

    // need to manually pass isEditing, as the state may not updated yet
    const updateSelectedTestcase = (isEditing: boolean) => {
        if (isEditing) {
            setSelectedTestcase(sampleTestcases[0] ?? undefined);
        } else {
            const nonHiddenTestcases = [
                ...sampleTestcases,
                ...customTestcases,
            ].filter((testcase) => !(testcase as SampleTestcase).isHidden);
            setSelectedTestcase(nonHiddenTestcases[0] ?? undefined);
        }
    };

    useEffect(() => {
        if (data?.codingEnvironments) {
            setCodingEnvironments(
                data?.codingEnvironments.map((env) => ({
                    id: env?.id ? parseInt(env.id) : 0,
                    name: env?.name ?? "",
                }))
            );
        }
        if (error) {
            console.error("Error fetching coding environments:", error);
        }
    }, [data, error]);

    const handleEditClick = () => {
        let editedQuestion: Question = new Object() as Question;
        editedQuestion.title = question.title;
        editedQuestion.description = question.description;
        editedQuestion.sampleCode = question.sampleCode;
        editedQuestion.language = question.language;
        editedQuestion.codingEnvironmentId = question.codingEnvironmentId;
        editedQuestion.execCommand = question.execCommand;
        editedQuestion.timeLimit = question.timeLimit;
        setIsEditing(true);
        setEditedQuestion(editedQuestion);
        updateSelectedTestcase(true);
    };

    const handleSaveClick = () => {
        onSaveQuestion();
        setIsEditing(false);
        updateSelectedTestcase(false);
    };

    const handleCancelClick = () => {
        if (editedQuestion.id == "") {
            router.push(`assignment?id=${assignmentId}`);
        } else {
            setEditedQuestion(question);
        }
        setIsEditing(false);
        updateSelectedTestcase(false);
    };

    const handleDeleteClick = () => {
        if (window.confirm("Are you sure you want to delete this question?")) {
            onDeleteQuestion();
        }
    };

    return (
        <CardWrapper className="h-full">
            <Box className="flex flex-col gap-2 overflow-auto h-full">
                <MUILink
                    href={`assignment?id=${assignmentId}`}
                    color="primary"
                    underline="hover"
                >
                    « Back to assignment page
                </MUILink>
                {allowEditOrCreate && isEditing ? (
                    <EditQuestionTab
                        editedQuestion={editedQuestion}
                        setEditedQuestion={setEditedQuestion}
                        handleSaveClick={handleSaveClick}
                        handleCancelClick={handleCancelClick}
                        codingEnvironments={codingEnvironments}
                    />
                ) : (
                    <QuestionTab
                        allowEditOrCreate={allowEditOrCreate}
                        question={question}
                        handleDeleteClick={handleDeleteClick}
                        handleEditClick={handleEditClick}
                    />
                )}
            </Box>
        </CardWrapper>
    );
}
