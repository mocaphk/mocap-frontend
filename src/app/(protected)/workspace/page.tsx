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
import { Alert, Box, Snackbar } from "@mui/material";
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
import type { CodeExecutionResult, ProgrammingLanguage } from "@schema";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import type { CustomTestcase, SampleTestcase } from "./types/Testcase";
import {
    useCreateCustomTestcasesMutation,
    useCreateAndUpdateTestcasesMutation,
    useDeleteCustomTestcaseMutation,
    useGetCustomTestcasesQuery,
    useUpdateCustomTestcaseMutation,
    useGetTestcasesLazyQuery,
    useGetNonHiddenTestcasesLazyQuery,
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

    // noti snackbar state
    const [openSaveCustomTestcaseSuccess, setOpenSaveCustomTestcaseSuccess] =
        React.useState<boolean>(false);
    const [openSaveCustomTestcaseError, setOpenSaveCustomTestcaseError] =
        React.useState<boolean>(false);
    const [openSaveQuestionSuccess, setOpenSaveQuestionSuccess] =
        React.useState<boolean>(false);
    const [openSaveQuestionError, setOpenSaveQuestionError] =
        React.useState<boolean>(false);
    const [openSubmissionSuccess, setOpenSubmissionSuccess] =
        React.useState<boolean>(false);
    const [openSubmissionError, setOpenSubmissionError] =
        React.useState<boolean>(false);
    const [openRunTestCaseError, setOpenRunTestCaseError] =
        React.useState<boolean>(false);
    const [openSubmitAttemptError, setOpenSubmitAttemptError] =
        React.useState<boolean>(false);

    const [allowEditOrCreate, setAllowEditOrCreate] = React.useState(false);

    // Assignment related states
    const [assignmentId, setAssignmentId] = React.useState(
        searchParams.get("assignmentId") ?? ""
    );
    const [courseId, setCourseId] = React.useState("");

    // get courseId by assignmentId
    const { refetch: refetchCourseId } = useGetCouseIdByAssignmentIdQuery({
        variables: { assignmentId: assignmentId },
        skip: assignmentId === "" || assignmentId === null,
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
    const currentQuestionId = questionIdFromUrl ?? "";
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
        data: questionDataRes,
        error: questionError,
        loading: questionLoading,
        refetch: refetchQuestion,
    } = useGetQuestionQuery({
        variables: { questionId: currentQuestionId },
        skip: currentQuestionId == "",
        onCompleted: (res) => {
            if (res.question?.id) {
                // local storage store latest attempted question
                localStorage.setItem(
                    "latestAttemptedQuestion",
                    res.question?.id
                );
            }
        },
    });

    const questionData = questionDataRes?.question;

    const questionNotFound =
        !questionLoading &&
        (questionDataRes === undefined ||
            questionError ||
            questionData === undefined ||
            questionData === null);

    // Handle fetched question
    React.useEffect(() => {
        if (questionData) {
            console.log("Question from server:", questionDataRes.question);
            setQuestion({
                id: questionIdFromUrl ?? "",
                title: questionData.title,
                description: questionData.description,
                language: questionData.language as ProgrammingLanguage,
                sampleCode: "",
                checkingMethod: questionData.checkingMethod!,
                execCommand: questionData.execCommand!,
                timeLimit: questionData.timeLimit,
                assignmentId: questionData.assignment?.id!,
                codingEnvironmentId: questionData.codingEnvironment?.id,
                isPublic: questionData.isPublic,
            });
            setAssignmentId(questionDataRes.question?.assignment?.id!);
        }
    }, [questionIdFromUrl, questionDataRes]);

    // Handle question creation
    const [createQuestionFunc] = useCreateQuestionMutation({
        variables: {
            questionInput: {
                ...editedQuestion,
            },
        },
        onCompleted: async (res) => {
            console.log("Created question with id:", res.createQuestion.id);
            router.replace(`workspace?questionId=${res.createQuestion.id}`);

            // success noti
            setOpenSaveQuestionSuccess(true);
        },
        onError: (error) => {
            console.error("createQuestionFunc error:", error);

            // error noti
            setOpenSaveQuestionError(true);
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
            router.replace(`workspace?questionId=${res.updateQuestion.id}`);
            refetchQuestion();

            // success noti
            setOpenSaveQuestionSuccess(true);
        },
        onError: (error) => {
            console.error("updateQuestionFunc error:", error);

            // error noti
            setOpenSaveQuestionError(true);
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

    // Run / submit attempt results
    const [results, setResults] = React.useState<CodeExecutionResult[]>([]);

    React.useEffect(() => {
        if (!isEditing) {
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
                setResults(res.runAttempt.results);
                setActiveTab("result");
            },
            onError: (error) => {
                console.error("submitAttemptFunc error:", error);
                setOpenSubmitAttemptError(true);
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
                setResults(res.submitAttempt.results);
                setActiveTab("result");

                setOpenSubmissionSuccess(true);
            },
            onError: (error) => {
                setOpenSubmissionError(true);

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
    const [getSampleTestcases, { loading: sampleTestcaseLoading }] =
        useGetTestcasesLazyQuery({
            fetchPolicy: "network-only",
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
                            isTimeout: false,
                        };
                    });
                    console.log("Testcases from server:", sampleTestcases);
                    setSampleTestcases(sampleTestcases);
                    const testcases = [...sampleTestcases, ...customTestcases];
                    setSelectedTestcase(testcases[0] ?? undefined);
                }
            },
        });

    const [
        getNonHiddenSampleTestcases,
        { loading: nonHiddenSampleTestcaseLoading },
    ] = useGetNonHiddenTestcasesLazyQuery({
        fetchPolicy: "network-only",
        variables: { questionId: question.id },
        onCompleted: (res) => {
            let sampleTestcases: SampleTestcase[] = [];
            if (res?.nonHiddenTestcases) {
                sampleTestcases = res.nonHiddenTestcases.map(
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
                            expectedOutput: testcase.expectedOutput,
                            isHidden: testcase.isHidden,
                            output: "",
                            isTimeout: false,
                        };
                    }
                );
                console.log("Testcases from server:", sampleTestcases);
                setSampleTestcases(sampleTestcases);
                const testcases = [...sampleTestcases, ...customTestcases];
                setSelectedTestcase(testcases[0] ?? undefined);
            }
        },
    });

    // fetch sample testcases base on the permission
    React.useEffect(() => {
        if (allowEditOrCreate) {
            getSampleTestcases();
        } else {
            getNonHiddenSampleTestcases();
        }
    }, [allowEditOrCreate, getNonHiddenSampleTestcases, getSampleTestcases]);

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
                        isTimeout: false,
                    };
                }
            );
            console.log("Testcases from server:", customTestcases);
            setCustomTestcases(customTestcases);
            const testcases = [...sampleTestcases, ...customTestcases];
            setSelectedTestcase(testcases[0] ?? undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customTestcasesRes]);

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
                getSampleTestcases();
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

            // success noti
            setOpenSaveCustomTestcaseSuccess(true);
        },
        onError: (error) => {
            console.error("createCustomTestcasesFunc error:", error);

            // fail noti
            setOpenSaveCustomTestcaseError(true);
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

            // success noti
            setOpenSaveCustomTestcaseSuccess(true);
        },
        onError: (error) => {
            console.error("updateCustomTestcaseFunc error:", error);

            // fail noti
            setOpenSaveCustomTestcaseError(true);
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
                setOpenRunTestCaseError(true);
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
                setResults(res.runAllTestcasesWithCode.results);
                setActiveTab("result");
            },
            onError: (error) => {
                console.error("runAllTestcasesFunc error:", error);
            },
        });

    const [activeTab, setActiveTab] = React.useState("testCase");

    // Loading state
    const [isLoading, setIsLoading] = React.useState(false);

    // Handle loading state
    React.useEffect(() => {
        let loading =
            questionLoading ||
            sampleTestcaseLoading ||
            nonHiddenSampleTestcaseLoading ||
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
        nonHiddenSampleTestcaseLoading,
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
                returnLink={`assignment?id=${assignmentId}`}
            />
        );
    }

    if (!isNewQuestion && questionNotFound) {
        return (
            <ErrorPage
                title="Question not found"
                message="Sorry, but the question you are searching for is not available."
                returnLink="courses"
                returnMessage="Back to course page"
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
                            getSampleTestcases={getSampleTestcases}
                            createAndUpdateSampleTestcasesFunc={
                                createAndUpdateSampleTestcasesFunc
                            }
                            setCodeOnEditor={setCodeOnEditor}
                        />
                    </Allotment.Pane>
                    <Allotment.Pane className="p-1" preferredSize="50%">
                        <ActionCard
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            isEditing={isEditing}
                            allowEditOrCreate={allowEditOrCreate}
                            language={question.language}
                            attemptsList={attemptsList}
                            sampleTestcases={sampleTestcases}
                            customTestcases={customTestcases}
                            selectedTestcase={selectedTestcase}
                            setSampleTestcases={setSampleTestcases}
                            setCustomTestcases={setCustomTestcases}
                            setSelectedTestcase={setSelectedTestcase}
                            deleteCustomTestcaseFunc={deleteCustomTestcaseFunc}
                            createCustomTestcasesFunc={
                                createCustomTestcasesFunc
                            }
                            updateCustomTestcaseFunc={updateCustomTestcaseFunc}
                            runTestcaseFunc={runTestcaseFunc}
                            createOrUpdateAttempt={createOrUpdateAttempt}
                            questionId={currentQuestionId}
                            codeOnEditor={codeOnEditor}
                            runTestcaseWithSampleCodeFunc={
                                runTestcaseWithSampleCodeFunc
                            }
                            results={results}
                            setCodeOnEditor={setCodeOnEditor}
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
            <Snackbar
                open={openSaveCustomTestcaseSuccess}
                autoHideDuration={3000}
                onClose={() => setOpenSaveCustomTestcaseSuccess(false)}
            >
                <Alert
                    onClose={() => setOpenSaveCustomTestcaseSuccess(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    Your custom test cases have been saved successfully.
                </Alert>
            </Snackbar>
            <Snackbar
                open={openSaveCustomTestcaseError}
                autoHideDuration={3000}
                onClose={() => setOpenSaveCustomTestcaseError(false)}
            >
                <Alert
                    onClose={() => setOpenSaveCustomTestcaseError(false)}
                    severity="error"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    An error occurred while saving your custom test case.
                </Alert>
            </Snackbar>
            <Snackbar
                open={openSaveQuestionSuccess}
                autoHideDuration={3000}
                onClose={() => setOpenSaveQuestionSuccess(false)}
            >
                <Alert
                    onClose={() => setOpenSaveQuestionSuccess(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    Your question have been saved successfully.
                </Alert>
            </Snackbar>
            <Snackbar
                open={openSaveQuestionError}
                autoHideDuration={3000}
                onClose={() => setOpenSaveQuestionError(false)}
            >
                <Alert
                    onClose={() => setOpenSaveQuestionError(false)}
                    severity="error"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    An error occurred while saving your question.
                </Alert>
            </Snackbar>
            <Snackbar
                open={openSubmissionSuccess}
                autoHideDuration={3000}
                onClose={() => setOpenSubmissionSuccess(false)}
            >
                <Alert
                    onClose={() => setOpenSubmissionSuccess(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    Your submission has been successfully submitted.
                </Alert>
            </Snackbar>
            <Snackbar
                open={openSubmissionError}
                autoHideDuration={3000}
                onClose={() => setOpenSubmissionError(false)}
            >
                <Alert
                    onClose={() => setOpenSubmissionError(false)}
                    severity="error"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    An error occurred while submitting your attempt
                </Alert>
            </Snackbar>
            <Snackbar
                open={openRunTestCaseError}
                autoHideDuration={3000}
                onClose={() => setOpenRunTestCaseError(false)}
            >
                <Alert
                    onClose={() => setOpenRunTestCaseError(false)}
                    severity="error"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    An error occurred while running test case
                </Alert>
            </Snackbar>
            <Snackbar
                open={openSubmitAttemptError}
                autoHideDuration={3000}
                onClose={() => setOpenSubmitAttemptError(false)}
            >
                <Alert
                    onClose={() => setOpenSubmitAttemptError(false)}
                    severity="error"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    An error occurred while submitting your attempt
                </Alert>
            </Snackbar>
        </Box>
    );
}
