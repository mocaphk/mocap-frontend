"use client";

import {
    useAddBookMutation,
    useGetAllBooksQuery,
    useGetBookByIdQuery,
    GetAllBooksDocument,
} from "../queries.graphql";
import { useCallback } from "react";

export default function DummyQueries() {
    const { data: data1, client: client1 } = useGetBookByIdQuery({
        variables: { bookId: "book-1" },
    });
    console.log("data1: ");
    console.log(client1);

    const { data: data2 } = useGetAllBooksQuery();
    console.log("data2: ");
    console.log(data2);

    const [addBookFunc, { data: data3 }] = useAddBookMutation({
        variables: {
            bkInput: {
                name: "Dummy name",
                pageCount: 123,
                author: { firstName: "Dummy first name" },
            },
        },
        refetchQueries: [{ query: GetAllBooksDocument }],
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
}
