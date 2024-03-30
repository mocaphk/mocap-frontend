"use client";

import {
    useAddBookMutation,
    useGetAllBooksQuery,
    useGetBookByIdQuery,
    GetAllBooksDocument,
} from "../queries/dummy.graphql";
import { useCallback } from "react";

import { BookType } from "@schema";

export default function DummyQueries() {
    const { data: data1 } = useGetBookByIdQuery({
        variables: { bookId: "1" },
    });

    const { data: data2 } = useGetAllBooksQuery();

    const [addBookFunc, { data: data3 }] = useAddBookMutation({
        variables: {
            bkInput: {
                name: "Dummy name",
                pageCount: 123,
                type: BookType.Comic,
                author: { firstName: "Dummy first name" },
            },
        },
        refetchQueries: [{ query: GetAllBooksDocument }],
        awaitRefetchQueries: true,
    });

    const handleClick = useCallback(async () => {
        await addBookFunc();
    }, [addBookFunc]);

    return (
        <div>
            <h1>
                getBookById (Only user with admin or lecturer role can get this
                data): Book information:
            </h1>
            <p>Name: {data1?.book?.name}</p>
            <p>Page Count: {data1?.book?.pageCount}</p>
            <p>Type: {data1?.book?.type}</p>
            <p>Author First Name: {data1?.book?.author?.firstName}</p>
            <br />
            <h1>
                getAllBooks (Only user with lecturer role can get this data):
            </h1>
            <ul>
                {data2?.allBooks?.map((book) => (
                    <li key={book?.id}>{book?.name}</li>
                ))}
            </ul>
            <br />
            <button onClick={handleClick}>
                Add Book (Can be click by any user (no role restriction))
            </button>
            {data3?.addBook && (
                <h1>addBook: Book name = {data3.addBook.name}</h1>
            )}
        </div>
    );
}
