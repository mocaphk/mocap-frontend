import { gql } from "../../__generated__/gql"

export const getBookById = gql(`
    query GetBookById($bookId: ID!) {
        book(id: $bookId) {
            id
            name
            pageCount
            author {
                id
                firstName
                lastName
            }
        }
    }
`);

export const getAllBooks = gql(`
    query GetAllBooks {
        allBooks {
            id
            name
            pageCount
            author {
                id
                firstName
                lastName
            }
        }
    }
`);

export const addBook = gql(`
    mutation AddBook($bkInput: BookInput!) {
        addBook(bookInput: $bkInput) {
            id
            name
            pageCount
            author {
                id
                firstName
                lastName
            }
        }
    }
`);
