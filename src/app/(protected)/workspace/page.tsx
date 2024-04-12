"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CodeEditorCard from "./components/CodeEditorCard";
import QuestionCard from "./components/QuestionCard";
import ActionCard from "./components/ActionCard";
import type { Question } from "./types/Question";
import type { Attempt } from "./types/Attempt";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { Box } from "@mui/material";
import {
    useGetQuestionQuery,
    useCreateQuestionMutation,
    useUpdateQuestionMutation,
    useDeleteQuestionMutation,
} from "../../graphql/workspace/question.graphql";
import {
    useCreateAttemptMutation,
    useGetAttemptsByQuestionIdQuery,
    useGetLatestUpdateByQuestionIdQuery,
    useUpdateAttemptMutation,
} from "../../graphql/workspace/attempt.graphql";
import { CheckingMethod, UserRole } from "@schema";
import type { ProgrammingLanguage } from "@schema";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import type { CustomTestcase, SampleTestcase } from "./types/Testcase";
import {
    useCreateCustomTestcasesMutation,
    useCreateAndUpdateTestcasesMutation,
    useDeleteCustomTestcaseMutation,
    useDeleteTestcaseMutation,
    useGetCustomTestcasesQuery,
    useGetTestcasesQuery,
    useUpdateCustomTestcaseMutation,
} from "@/app/graphql/workspace/testcase.graphql";
import { v4 as uuidv4 } from "uuid";
import {
    useRunAllTestcasesWithCodeLazyQuery,
    useRunAttemptLazyQuery,
    useRunTestcaseLazyQuery,
    useRunTestcaseWithCodeLazyQuery,
    useSubmitAttemptMutation,
} from "@/app/graphql/workspace/codeExecution.graphql";
import { useGetCouseIdByAssignmentIdQuery } from "@/app/graphql/course/assignment.graphql";
import type { GetCouseIdByAssignmentIdQuery } from "@/app/graphql/course/assignment.graphql";
import { useGetCourseUserRolesLazyQuery } from "@/app/graphql/course/course.graphql";
import ErrorPage from "@/app/errors/errorPage";

export default function WorkspacePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const questionIdFromUrl = searchParams.get("questionId");

    const [allowEditOrCreate, setAllowEditOrCreate] = React.useState(false);

    // Assignment related states
    const [assignmentId, setAssignmentId] = React.useState(
        searchParams.get("assignmentId") ?? ""
    );
    const [courseId, setCourseId] = React.useState("");

    // get courseId by assignmentId
    const { refetch: refetchCourseId } = useGetCouseIdByAssignmentIdQuery({
        variables: { assignmentId: assignmentId },
        skip: assignmentId === "",
        onCompleted: (data: GetCouseIdByAssignmentIdQuery) => {
            setCourseId(data.assignment?.course.id ?? "");
            getRolesDataFunc({
                variables: { courseId: data.assignment?.course.id ?? "" },
            });
            console.log("Course Id from server:", data.assignment?.course.id);
        },
    });

    const [getRolesDataFunc] = useGetCourseUserRolesLazyQuery({
        fetchPolicy: "network-only",
        onCompleted: (res) => {
            console.log("Roles from server:", res.getCourseUserRoles);
            const roles = res.getCourseUserRoles;
            const isAdmin = roles?.includes(UserRole.Admin) ?? false;
            const isLecturer = roles?.includes(UserRole.Lecturer) ?? false;
            const isTutor = roles?.includes(UserRole.Tutor) ?? false;

            const allowEditOrCreate = isAdmin || isLecturer || isTutor;
            setAllowEditOrCreate(allowEditOrCreate);
        },
    });

    React.useEffect(() => {
        refetchCourseId();
    }, [assignmentId, refetchCourseId]);

    // Question related states
    const [isNewQuestion, setIsNewQuestion] = React.useState(
        questionIdFromUrl === ""
    );
    const [isEditing, setIsEditing] = React.useState(questionIdFromUrl === "");
    const [currentQuestionId, setCurrentQuestionId] = React.useState<string>(
        questionIdFromUrl ?? ""
    );
    const [question, setQuestion] = React.useState<Question>(
        new Object() as Question
    );
    let newQuestion: Question = new Object() as Question;
    newQuestion.assignmentId = assignmentId ?? "";
    newQuestion.description = "";
    newQuestion.sampleCode = "";
    newQuestion.checkingMethod = CheckingMethod.Console;
    newQuestion.isPublic = true;

    const [editedQuestion, setEditedQuestion] = React.useState<Question>(
        questionIdFromUrl == "" ? newQuestion : question
    );

    // Fetching question
    const {
        data: res = {},
        refetch,
        loading: questionLoading,
    } = useGetQuestionQuery({
        variables: { questionId: currentQuestionId },
        skip: currentQuestionId == "",
    });

    // Handle fetched question
    React.useEffect(() => {
        if (res?.question) {
            console.log("Question from server:", res.question);
            setQuestion({
                id: questionIdFromUrl ?? "",
                title: res.question?.title,
                description: res.question?.description,
                language: res.question?.language as ProgrammingLanguage,
                sampleCode: res.question?.sampleCode!,
                checkingMethod: res.question?.checkingMethod!,
                execCommand: res.question?.execCommand!,
                timeLimit: res.question?.timeLimit,
                assignmentId: res.question?.assignment?.id!,
                testcases: [],
                codingEnvironmentId: res.question?.codingEnvironment?.id,
                isPublic: res.question?.isPublic,
            });
            setAssignmentId(res.question?.assignment?.id!);
        }
    }, [questionIdFromUrl, res]);

    // Handle question creation
    const [createQuestionFunc] = useCreateQuestionMutation({
        variables: {
            questionInput: {
                ...editedQuestion,
            },
        },
        onCompleted: async (res) => {
            console.log("Created question with id:", res.createQuestion.id);
            router.push(`workspace?questionId=${res.createQuestion.id}`);
            setCurrentQuestionId(res.createQuestion.id);
        },
        onError: (error) => {
            console.error("createQuestionFunc error:", error);
        },
    });

    // Handle question update
    const [updateQuestionFunc] = useUpdateQuestionMutation({
        variables: {
            questionId: question.id,
            questionInput: {
                ...editedQuestion,
            },
        },
        onCompleted: (res) => {
            console.log("Updated question with id:", res.updateQuestion.id);
            setCurrentQuestionId(res.updateQuestion.id);
            refetch().then((response) => {
                setQuestion({
                    id: response.data.question?.id!,
                    title: response.data.question?.title!,
                    description: response.data.question?.description!,
                    language: response.data.question
                        ?.language as ProgrammingLanguage,
                    sampleCode: response.data.question?.sampleCode!,
                    checkingMethod: response.data.question?.checkingMethod!,
                    execCommand: response.data.question?.execCommand!,
                    timeLimit: response.data.question?.timeLimit!,
                    assignmentId: response.data.question?.assignment?.id!,
                    testcases: [],
                    codingEnvironmentId:
                        response.data.question?.codingEnvironment?.id,
                    isPublic: response.data.question?.isPublic!,
                });
            });
        },
        onError: (error) => {
            console.error("updateQuestionFunc error:", error);
        },
    });

    // Handle question save
    const saveQuestion = async () => {
        if (isNewQuestion) {
            try {
                await createQuestionFunc();
                setIsNewQuestion(false);
                console.log("Created question");
            } catch (error) {
                console.error("Error creating:", error);
            }
        } else {
            try {
                await updateQuestionFunc();
                console.log("Updated question");
            } catch (error) {
                console.error("Error updating:", error);
            }
        }
    };

    // Handle question deletion
    const [deleteQuestionFunc] = useDeleteQuestionMutation({
        variables: {
            questionId: question.id,
        },
        onCompleted: (res) => {
            console.log("Question Id", res.deleteQuestion.id);
            router.push(`assignment?id=${assignmentId}`);
        },
        onError: (error) => {
            console.error("deleteQuestionFunc error:", error);
        },
    });

    const deleteQuestion = async () => {
        try {
            await deleteQuestionFunc();
            console.log("Deleted question");
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    // Attempts related states
    const [codeOnEditor, setCodeOnEditor] = React.useState("");

    const [attemptsList, setAttemptsList] = React.useState(
        new Array() as Attempt[]
    );
    const [currentAttempt, setCurrentAttempt] = React.useState(
        new Object() as Attempt
    );

    React.useEffect(() => {
        if (isEditing) {
            setCodeOnEditor(editedQuestion.sampleCode);
        } else {
            setCodeOnEditor(currentAttempt.code ?? "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAttempt, isEditing]);

    // Fetching attempts if question Id not empty
    const { data: attemptsRes = {}, refetch: refetchAttempts } =
        useGetAttemptsByQuestionIdQuery({
            variables: { questionId: questionIdFromUrl ?? "" },
            skip: questionIdFromUrl === "",
        });

    const { data: latestUpdateRes = {} } = useGetLatestUpdateByQuestionIdQuery({
        variables: { questionId: questionIdFromUrl ?? "" },
        skip: questionIdFromUrl === "",
        onCompleted: (res: any) => {
            if (res.latestUpdate) {
                console.log("Latest update from server:", res.latestUpdate);
                setCurrentAttempt({
                    id: res.latestUpdate.id,
                    isSubmitted: res.latestUpdate.isSubmitted,
                    createdAt: new Date(res.latestUpdate.createdAt), // Convert string to Date
                    updatedAt: new Date(res.latestUpdate.updatedAt),
                    executedAt: null,
                    code: res.latestUpdate.code ?? "",
                    questionId: currentQuestionId,
                });
            }
        },
    });

    // Handle fetched attempts
    React.useEffect(() => {
        if (attemptsRes && (attemptsRes as { attempts: Attempt[] }).attempts) {
            console.log(
                "Attempts from server:",
                (attemptsRes as { attempts: Attempt[] }).attempts
            );

            setAttemptsList((attemptsRes as { attempts: Attempt[] }).attempts);
        }
    }, [questionIdFromUrl, attemptsRes]);

    // eslint-disable-next-line unused-imports/no-unused-vars
    const [runAttemptFunc, { loading: runAttemptLoading }] =
        useRunAttemptLazyQuery({
            fetchPolicy: "network-only",
            onCompleted: (res) => {
                console.log("run attempt result:", res.runAttempt.results);
                refetchAttempts();
            },
            onError: (error) => {
                console.error("submitAttemptFunc error:", error);
            },
        });

    const [submitAttemptFunc, { loading: submitAttemptLoading }] =
        useSubmitAttemptMutation({
            variables: {
                attemptId: currentAttempt.id ?? "",
            },
            onCompleted: (res) => {
                console.log(
                    "Submit attempt result:",
                    res.submitAttempt.results
                );
                refetchAttempts();
            },
            onError: (error) => {
                console.error("submitAttemptFunc error:", error);
            },
        });

    const [createAttemptFunc] = useCreateAttemptMutation({
        variables: {
            attemptInput: {
                questionId: question.id,
                code: codeOnEditor,
            },
        },
        onCompleted: (res) => {
            console.log("Attempt Id", res.createAttempt.id);
        },
        onError: (error) => {
            console.error("createAttemptFunc error:", error);
        },
    });

    const [updateAttemptFunc] = useUpdateAttemptMutation({
        variables: {
            attemptId: currentAttempt.id ?? "",
            attemptInput: {
                code: codeOnEditor,
            },
        },
        onCompleted: (res) => {
            console.log("Attempt Id", res.updateAttempt.id);
        },
        onError: (error) => {
            console.error("updateAttemptFunc error:", error);
        },
    });

    const createOrUpdateAttempt = async (isSubmitted: boolean) => {
        let currentAttemptId = currentAttempt.id;
        let data;

        if (!currentAttempt.id || currentAttempt.isSubmitted) {
            let response = await createAttemptFunc({
                variables: {
                    attemptInput: {
                        questionId: question.id,
                        code: codeOnEditor,
                    },
                },
            });
            data = response.data?.createAttempt;
            currentAttemptId = response.data?.createAttempt.id;
        } else {
            let response = await updateAttemptFunc({
                variables: {
                    attemptId: currentAttempt.id,
                    attemptInput: {
                        code: codeOnEditor,
                    },
                },
            });
            data = response.data?.updateAttempt;
            currentAttemptId = response.data?.updateAttempt.id;
        }

        const createdAt = data?.createdAt ? new Date(data?.createdAt) : null;
        const updatedAt = data?.updatedAt ? new Date(data?.updatedAt) : null;
        const executedAt = data?.executedAt ? new Date(data?.executedAt) : null;
        setCurrentAttempt({
            id: currentAttemptId,
            isSubmitted,
            createdAt,
            updatedAt,
            executedAt,
            code: codeOnEditor,
            questionId: currentAttempt.questionId,
        });
        refetchAttempts();
        return currentAttemptId;
    };

    // testcases related states
    const [sampleTestcases, setSampleTestcases] = React.useState(
        new Array<SampleTestcase>()
    );
    const [customTestcases, setCustomTestcases] = React.useState(
        new Array<CustomTestcase>()
    );
    const [selectedTestcase, setSelectedTestcase] = React.useState<
        SampleTestcase | CustomTestcase | undefined
    >(sampleTestcases[0] ?? customTestcases[0] ?? undefined);

    // Fetching sample testcases
    const { loading: sampleTestcaseLoading, refetch: refetchSampleTestcase } =
        useGetTestcasesQuery({
            notifyOnNetworkStatusChange: true,
            variables: { questionId: question.id },
            onCompleted: (res) => {
                let sampleTestcases: SampleTestcase[] = [];
                if (res?.testcases) {
                    sampleTestcases = res.testcases.map((testcase: any) => {
                        return {
                            tempId: uuidv4(),
                            id: testcase.id,
                            input: testcase.input.map((input: any) => {
                                return {
                                    name: input.name,
                                    value: input.value,
                                };
                            }),
                            expectedOutput: testcase.expectedOutput,
                            isHidden: testcase.isHidden,
                            output: "",
                        };
                    });
                    console.log("Testcases from server:", sampleTestcases);
                    setSampleTestcases(sampleTestcases);
                    const nonHiddenTestcases = [
                        ...sampleTestcases,
                        ...customTestcases,
                    ].filter(
                        (testcase) => !(testcase as SampleTestcase).isHidden
                    );
                    setSelectedTestcase(nonHiddenTestcases[0] ?? undefined);
                }
            },
        });

    // Fetching custom testcases
    const {
        data: customTestcasesRes = {} as any,
        loading: customTestcaseLoading,
        refetch: refetchCustomTestcase,
    } = useGetCustomTestcasesQuery({
        variables: { questionId: question.id },
    });

    React.useEffect(() => {
        let customTestcases: CustomTestcase[] = [];
        if (customTestcasesRes?.customTestcases) {
            customTestcases = customTestcasesRes.customTestcases.map(
                (testcase: any) => {
                    return {
                        tempId: uuidv4(),
                        id: testcase.id,
                        input: testcase.input.map((input: any) => {
                            return {
                                name: input.name,
                                value: input.value,
                            };
                        }),
                        expectedOutput: "",
                        output: "",
                    };
                }
            );
            console.log("Testcases from server:", customTestcases);
            setCustomTestcases(customTestcases);
            const nonHiddenTestcases = [
                ...sampleTestcases,
                ...customTestcases,
            ].filter((testcase) => !(testcase as SampleTestcase).isHidden);
            setSelectedTestcase(nonHiddenTestcases[0] ?? undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customTestcasesRes]);

    // handle delete sample testcases
    const [deleteSampleTestcaseFunc] = useDeleteTestcaseMutation({
        onCompleted: (res) => {
            console.log("Testcase Id", res.deleteTestcase.id);
            refetchSampleTestcase();
        },
        onError: (error) => {
            console.error("deleteTestcaseFunc error:", error);
        },
    });

    // handle delete custom testcases
    const [deleteCustomTestcaseFunc] = useDeleteCustomTestcaseMutation({
        onCompleted: (res) => {
            console.log("Testcase Id", res.deleteCustomTestcase.id);
            refetchCustomTestcase();
        },
        onError: (error) => {
            console.error("deleteCustomTestcaseFunc error:", error);
        },
    });

    // Create/ update testcases
    const [createAndUpdateSampleTestcasesFunc] =
        useCreateAndUpdateTestcasesMutation({
            onCompleted: () => {
                refetchSampleTestcase();
            },
            onError: (error) => {
                console.error("createTestcasesFunc error:", error);
            },
        });

    const [createCustomTestcasesFunc] = useCreateCustomTestcasesMutation({
        variables: {
            questionId: question.id,
            testcaseInput: {
                input: selectedTestcase?.input ?? [],
            },
        },
        onCompleted: (res) => {
            console.log("Testcase Id", res.createCustomTestcases[0].id);
            let newTestcaseCopy = JSON.parse(
                JSON.stringify(selectedTestcase as SampleTestcase)
            );
            newTestcaseCopy.id = res.createCustomTestcases[0].id;
            setSelectedTestcase(newTestcaseCopy);
            setCustomTestcases((prevCustomTestcases) => {
                const updatedTestcases = prevCustomTestcases.map((testcase) => {
                    if (testcase.tempId === newTestcaseCopy.tempId) {
                        return newTestcaseCopy;
                    }
                    return testcase;
                });

                if (
                    !updatedTestcases.find(
                        (testcase) => testcase.tempId === newTestcaseCopy.tempId
                    )
                ) {
                    updatedTestcases.push(newTestcaseCopy);
                }

                return updatedTestcases;
            });
        },
        onError: (error) => {
            console.error("createCustomTestcasesFunc error:", error);
        },
    });

    const [updateCustomTestcaseFunc] = useUpdateCustomTestcaseMutation({
        variables: {
            testcaseId: selectedTestcase?.id ?? "",
            testcaseInput: {
                input: selectedTestcase?.input ?? [],
            },
        },
        onCompleted: (res) => {
            console.log("Testcase Id", res.updateCustomTestcase.id);
        },
        onError: (error) => {
            console.error("updateCustomTestcaseFunc error:", error);
        },
    });

    // Run testcase
    const [runTestcaseFunc, { loading: runTestcaseLoading }] =
        useRunTestcaseLazyQuery({
            fetchPolicy: "network-only",
            onCompleted: (res) => {
                console.log("Testcase output", res.runTestcase.output);
                console.log(
                    "Testcase sample output",
                    res.runTestcase.sampleOutput
                );
            },
            onError: (error) => {
                console.error("runTestcaseFunc error:", error);
            },
        });

    // Run sample code
    const [
        runTestcaseWithSampleCodeFunc,
        { loading: runTestcaseWithSampleCodeLoading },
    ] = useRunTestcaseWithCodeLazyQuery({
        fetchPolicy: "network-only",
        onCompleted: (res) => {
            console.log("Testcase output", res.runTestcaseWithCode.output);
            console.log(
                "Testcase sample output",
                res.runTestcaseWithCode.sampleOutput
            );
        },
        onError: (error) => {
            console.error("runTestcaseWithSampleCodeFunc error:", error);
        },
    });

    const [runSampleTestcasesFunc, { loading: runSampleTestcasesLoading }] =
        useRunAllTestcasesWithCodeLazyQuery({
            fetchPolicy: "network-only",
            onCompleted: (res) => {
                console.log(
                    "Testcase output",
                    res.runAllTestcasesWithCode.results
                );
            },
            onError: (error) => {
                console.error("runAllTestcasesFunc error:", error);
            },
        });

    // Loading state
    const [isLoading, setIsLoading] = React.useState(false);

    // Handle loading state
    React.useEffect(() => {
        let loading =
            questionLoading ||
            sampleTestcaseLoading ||
            customTestcaseLoading ||
            runTestcaseLoading ||
            runAttemptLoading ||
            submitAttemptLoading ||
            runTestcaseWithSampleCodeLoading ||
            runSampleTestcasesLoading;
        setIsLoading(loading);
    }, [
        questionLoading,
        sampleTestcaseLoading,
        customTestcaseLoading,
        runTestcaseLoading,
        runAttemptLoading,
        submitAttemptLoading,
        runTestcaseWithSampleCodeLoading,
        runSampleTestcasesLoading,
    ]);

    // Handle code change
    const handleCodeChange = (newCode: string) => {
        setEditedQuestion((prevQuestion) => ({
            ...prevQuestion,
            sampleCode: newCode,
        }));
    };

    // Error page
    if (
        (!allowEditOrCreate && isEditing) ||
        (!allowEditOrCreate && isNewQuestion)
    ) {
        return (
            <ErrorPage
                title="No permission"
                message="It appears that you do not have the necessary permissions to create or edit the question for this course."
                returnMessage="Back to assignment page"
                returnLink={`assignmnet?id=${assignmentId}`}
            />
        );
    }

    return (
        <Box className="flex h-full">
            <Backdrop open={isLoading} style={{ zIndex: 9999, color: "#fff" }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Allotment separator={false} snap>
                <Allotment vertical separator={false} snap>
                    <Allotment.Pane className="p-1" preferredSize="50%">
                        <QuestionCard
                            courseId={courseId}
                            assignmentId={assignmentId}
                            question={question}
                            isNewQuestion={isNewQuestion}
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                            allowEditOrCreate={allowEditOrCreate}
                            editedQuestion={editedQuestion}
                            setEditedQuestion={setEditedQuestion}
                            onDeleteQuestion={deleteQuestion}
                            onSaveQuestion={saveQuestion}
                            sampleTestcases={sampleTestcases}
                            customTestcases={customTestcases}
                            setSelectedTestcase={setSelectedTestcase}
                            refetchSampleTestcases={refetchSampleTestcase}
                            createAndUpdateSampleTestcasesFunc={
                                createAndUpdateSampleTestcasesFunc
                            }
                        />
                    </Allotment.Pane>
                    <Allotment.Pane className="p-1" preferredSize="50%">
                        <ActionCard
                            isEditing={isEditing}
                            allowEditOrCreate={allowEditOrCreate}
                            language={question.language}
                            attemptsList={attemptsList}
                            setCurrentAttempt={setCurrentAttempt}
                            sampleTestcases={sampleTestcases}
                            customTestcases={customTestcases}
                            selectedTestcase={selectedTestcase}
                            setSampleTestcases={setSampleTestcases}
                            setCustomTestcases={setCustomTestcases}
                            setSelectedTestcase={setSelectedTestcase}
                            deleteSampleTestcaseFunc={deleteSampleTestcaseFunc}
                            deleteCustomTestcaseFunc={deleteCustomTestcaseFunc}
                            createAndUpdateSampleTestcasesFunc={
                                createAndUpdateSampleTestcasesFunc
                            }
                            createCustomTestcasesFunc={
                                createCustomTestcasesFunc
                            }
                            updateCustomTestcaseFunc={updateCustomTestcaseFunc}
                            runTestcaseFunc={runTestcaseFunc}
                            createOrUpdateAttempt={createOrUpdateAttempt}
                            questionId={question.id}
                            codeOnEditor={codeOnEditor}
                            runTestcaseWithSampleCodeFunc={
                                runTestcaseWithSampleCodeFunc
                            }
                        />
                    </Allotment.Pane>
                </Allotment>
                <Allotment.Pane className="p-1" minSize={400}>
                    <CodeEditorCard
                        question={question}
                        isEditing={isEditing}
                        allowEditOrCreate={allowEditOrCreate}
                        updateSampleCode={handleCodeChange}
                        codeOnEditor={codeOnEditor}
                        setCodeOnEditor={setCodeOnEditor}
                        createOrUpdateAttempt={createOrUpdateAttempt}
                        runAttemptFunc={runAttemptFunc}
                        runSampleTestcasesFunc={runSampleTestcasesFunc}
                        submitAttemptFunc={submitAttemptFunc}
                        sampleTestcases={sampleTestcases}
                        customTestcases={customTestcases}
                    />
                </Allotment.Pane>
            </Allotment>
        </Box>
    );
}
