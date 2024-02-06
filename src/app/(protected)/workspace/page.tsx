"use client";
import React from "react";
import CodeEditorCard from "./components/CodeEditorCard";
import QuestionCard from "./components/QuestionCard";
import ActionCard from "./components/ActionCard";
import type { Question } from "./types/Question";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { Box } from "@mui/material";

export default function WorkspacePage() {
    const question: Question = {
        id: "1",
        assignmentId: "COMP2396 2023 A1",
        title: "Hello World",
        language: "python",
        description:
            "This assignment tests your understanding of classes and objects, and their implementations in Java. You are required to implement 4 public classes, namely Shape, Square, Triangle and Circle. The Square class, Triangle class and Circle class are used to model squares, triangles, and circles, respectively. They are subclasses of the Shape class which provides an abstraction of general shapes. For each of the 4 classes mentioned above, you are required to design and implement a tester class to test the correctness of your implementation.",
        sampleCode: "write your code here",
        testCases: [
            {
                id: "1",
                questionId: "1",
                variables: {
                    num: 1,
                    str: "hello",
                },
                providedByTeacher: true,
            },
            {
                id: "2",
                questionId: "1",
                variables: {
                    num: 2,
                    str: "world",
                },
                providedByTeacher: false,
            },
        ],
    };
    return (
        <Box className="flex h-full">
            <Allotment separator={false} snap>
                <Allotment vertical separator={false} snap>
                    <Allotment.Pane className="p-1" preferredSize="50%">
                        <QuestionCard question={question} />
                    </Allotment.Pane>
                    <Allotment.Pane className="p-1" preferredSize="50%">
                        <ActionCard language={question.language} />
                    </Allotment.Pane>
                </Allotment>
                <Allotment.Pane className="p-1" minSize={400}>
                    <CodeEditorCard question={question} />
                </Allotment.Pane>
            </Allotment>
        </Box>
    );
}
