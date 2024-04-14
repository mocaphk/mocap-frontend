import React, { useEffect, useState } from "react";
import type { Question } from "../types/Question";
import { Alert, Box, Link as MUILink, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
import { useGetCodingEnvironmentByAssignmentIdQuery } from "../../../graphql/workspace/codingEnvironment.graphql";
import CardWrapper from "@/app/components/CardWrapper";
import EditQuestionTab from "./questionTabs/editQuestionTab";
import QuestionTab from "./questionTabs/questionTab";
import type { SampleTestcase, CustomTestcase } from "../types/Testcase";
import { useGetSampleCodeLazyQuery } from "@/app/graphql/workspace/question.graphql";

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
    getSampleTestcases,
    createAndUpdateSampleTestcasesFunc,
    setCodeOnEditor,
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
    getSampleTestcases: Function;
    createAndUpdateSampleTestcasesFunc: Function;
    setCodeOnEditor: Function;
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
            const testcases = [...sampleTestcases, ...customTestcases];
            setSelectedTestcase(testcases[0] ?? undefined);
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
    }, [data]);

    const [getSampleCode] = useGetSampleCodeLazyQuery({
        fetchPolicy: "network-only",
        variables: { questionId: question.id },
    });

    const handleEditClick = async () => {
        const res = await getSampleCode();
        let editedQuestion: Question = new Object() as Question;
        editedQuestion.title = question.title;
        editedQuestion.description = question.description;
        editedQuestion.sampleCode = res.data?.question?.sampleCode ?? "";
        editedQuestion.language = question.language;
        editedQuestion.codingEnvironmentId = question.codingEnvironmentId;
        editedQuestion.execCommand = question.execCommand;
        editedQuestion.timeLimit = question.timeLimit;
        editedQuestion.isPublic = question.isPublic;
        editedQuestion.checkingMethod = question.checkingMethod;
        editedQuestion.assignmentId = question.assignmentId;
        setIsEditing(true);
        setEditedQuestion(editedQuestion);
        updateSelectedTestcase(true);
        setCodeOnEditor(res.data?.question?.sampleCode);
    };

    const handleSaveClick = () => {
        // validate input
        if (!validateEditQuestion()) {
            // prompt snackbar
            setOpenEditQuestionInvalid(true);
            return;
        }
        onSaveQuestion();
        setIsEditing(false);
        updateSelectedTestcase(false);
    };

    const handleCancelClick = () => {
        if (isNewQuestion) {
            router.push(`assignment?id=${assignmentId}`);
            return;
        }
        getSampleTestcases();
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
