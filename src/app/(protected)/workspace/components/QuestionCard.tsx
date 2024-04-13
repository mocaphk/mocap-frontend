import React, { useEffect, useState } from "react";
import type { Question } from "../types/Question";
import { Alert, Box, Link as MUILink, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
import { useGetCodingEnvironmentByAssignmentIdQuery } from "../../../graphql/workspace/codingEnvironment.graphql";
import CardWrapper from "@/app/components/CardWrapper";
import EditQuestionTab from "./questionTabs/editQuestionTab";
import QuestionTab from "./questionTabs/questionTab";
import type { SampleTestcase, CustomTestcase } from "../types/Testcase";

export default function QuestionCard({
    courseId,
    assignmentId,
    question,
    isNewQuestion,
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
    refetchSampleTestcases,
    createAndUpdateSampleTestcasesFunc,
}: Readonly<{
    courseId: string;
    assignmentId: string;
    question: Question;
    isNewQuestion: boolean;
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
    refetchSampleTestcases: Function;
    createAndUpdateSampleTestcasesFunc: Function;
}>) {
    const router = useRouter();

    const [openEditQuestionInvalid, setOpenEditQuestionInvalid] =
        useState<boolean>(false);

    const [codingEnvironments, setCodingEnvironments] = useState<
        { id: number; name: string }[]
    >([]);

    const {
        data,
        error,
        refetch: refetchEnv,
    } = useGetCodingEnvironmentByAssignmentIdQuery({
        skip: !isEditing,
        variables: { assignmentId: assignmentId },
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
        editedQuestion.isPublic = question.isPublic;
        setIsEditing(true);
        setEditedQuestion(editedQuestion);
        updateSelectedTestcase(true);
    };

    const handleSaveClick = () => {
        // validate input
        if (!validateEditQuestion()) {
            // prompt snackbar
            setOpenEditQuestionInvalid(true);
            return;
        }
        let sampleTescasesCopy = JSON.parse(JSON.stringify(sampleTestcases));
        sampleTescasesCopy.forEach((testcase: any) => {
            if (testcase.tempId) {
                delete testcase.tempId;
                delete testcase.output;
                delete testcase.isTimeout;
            }
            testcase.expectedOutput = "";
        });

        onSaveQuestion();
        setIsEditing(false);
        createAndUpdateSampleTestcasesFunc({
            variables: {
                questionId: question.id,
                testcaseInput: sampleTescasesCopy,
            },
        });
        updateSelectedTestcase(false);
    };

    const handleCancelClick = () => {
        if (isNewQuestion) {
            router.push(`assignment?id=${assignmentId}`);
            return;
        }
        refetchSampleTestcases();
        setIsEditing(false);
        setEditedQuestion(question);
        updateSelectedTestcase(false);
    };

    const handleDeleteClick = () => {
        onDeleteQuestion();
    };

    const validateEditQuestion = () => {
        return (
            editedQuestion.title &&
            editedQuestion.description &&
            editedQuestion.language &&
            editedQuestion.codingEnvironmentId &&
            editedQuestion.execCommand
        );
    };

    return (
        <CardWrapper className="h-full">
            <Box className="flex flex-col overflow-auto h-full">
                <Box>
                    <MUILink
                        href={`assignment?id=${assignmentId}`}
                        color="primary"
                        underline="hover"
                    >
                        « Back to assignment page
                    </MUILink>
                </Box>
                {allowEditOrCreate && isEditing ? (
                    <EditQuestionTab
                        courseId={courseId}
                        editedQuestion={editedQuestion}
                        setEditedQuestion={setEditedQuestion}
                        handleSaveClick={handleSaveClick}
                        handleCancelClick={handleCancelClick}
                        handleDeleteClick={handleDeleteClick}
                        codingEnvironments={codingEnvironments}
                        refetchEnv={refetchEnv}
                    />
                ) : (
                    <QuestionTab
                        allowEditOrCreate={allowEditOrCreate}
                        question={question}
                        handleEditClick={handleEditClick}
                    />
                )}
            </Box>
            <Snackbar
                open={openEditQuestionInvalid}
                autoHideDuration={3000}
                onClose={() => setOpenEditQuestionInvalid(false)}
            >
                <Alert
                    onClose={() => setOpenEditQuestionInvalid(false)}
                    severity="error"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    Please make sure all required fields are filled in before
                    proceeding.
                </Alert>
            </Snackbar>
        </CardWrapper>
    );
}
