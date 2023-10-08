"use client";

import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { addBook, getAllBooks, getBookById } from "./queries";
import { Suspense, useCallback } from "react";
import { useMutation } from "@apollo/client";

const DummyQueries = () => {
    const { data: data1, client: client1 } = useSuspenseQuery(getBookById, {
        variables: { bookId: "book-1" },
    });
    console.log("data1: ");
    console.log(client1);

    const { data: data2 } = useSuspenseQuery(getAllBooks);
    console.log("data2: ");
    console.log(data2);

    const [addBookFunc, { data: data3 }] = useMutation(addBook, {
        variables: {
            bkInput: {
                name: "nani",
                pageCount: 123,
                author: { firstName: "It's me mario" },
            },
        },
        refetchQueries: [{ query: getAllBooks }],
        awaitRefetchQueries: true,
    });

    const handleClick = useCallback(async () => {
        await addBookFunc();
        console.log("data3: ");
        console.log(data3);
    }, [addBookFunc]);

    return (
        <div>
            <h1>getBookById: Book name = {data1?.book?.name}</h1>
            <h1>getAllBooks:</h1>
            <ul>
                {data2?.allBooks?.map((book) => (
                    <li key={book?.id}>{book?.name}</li>
                ))}
            </ul>
            <button onClick={handleClick}>Add Book</button>
            {data3?.addBook && (
                <h1>addBook: Book name = {data3.addBook.name}</h1>
            )}
        </div>
    );
};

export default function Dummy() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="mb-64 text-center lg:max-w-5xl lg:w-full lg:grid-cols-4 lg:text-left">
                Hi Dummy Page, the environment is {process.env.NODE_ENV} and the
                graphql uri is {process.env.NEXT_PUBLIC_API_URL}
            </div>
            <div className="mb-64 text-center lg:max-w-5xl lg:w-full lg:grid-cols-4 lg:text-left">
                <Suspense fallback={<div>Loading...</div>}>
                    <DummyQueries />
                </Suspense>
            </div>
        </main>
    );
}
