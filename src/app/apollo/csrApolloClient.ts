// Client Components (with server side rendering)
// https://www.apollographql.com/blog/announcement/frontend/using-apollo-client-with-next-js-13-releasing-an-official-library-to-support-the-app-router/

// Client Components can automatically update all usages of an entity
// in the application, for example as a result of a graphql mutation

// Use it in layout.tsx like this: <ApolloWrapper>{children}</ApolloWrapper>
// then in page.tsx add "use client" and use useQuery() or useSuspenseQuery() to fetch data
// and useMutation() to call a graphql mutaion

// See https://www.apollographql.com/docs/react/data/suspense/ for useSuspenseQuery()

import { HttpLink, from } from "@apollo/client";
import {
    NextSSRApolloClient,
    NextSSRInMemoryCache,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { setContext } from "@apollo/client/link/context";
import { getSession } from "next-auth/react";

export default function makeClient() {
    const httpLink = new HttpLink({
        uri: process.env.NEXT_PUBLIC_API_URL,
        // TODO: properly handle cache
        fetchOptions: { cache: "no-store" },
    });

    const authLink = setContext(async (operation, { headers }) => {
        const session = await getSession();
        return {
            credentials: "include",
            headers: {
                ...headers,
                authorization: session?.accessToken
                    ? `Bearer ${session.accessToken}`
                    : "",
            },
        };
    });

    return new NextSSRApolloClient({
        ssrMode: true,
        cache: new NextSSRInMemoryCache(),
        link: from([authLink, httpLink]),
    });
}
