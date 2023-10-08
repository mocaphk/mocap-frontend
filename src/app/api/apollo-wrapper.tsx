"use client";

// Client Components (with server side rendering)
// https://www.apollographql.com/blog/announcement/frontend/using-apollo-client-with-next-js-13-releasing-an-official-library-to-support-the-app-router/

// Client Components can automatically update all usages of an entity
// in the application, for example as a result of a graphql mutation

// Use it in layout.tsx like this: <ApolloWrapper>{children}</ApolloWrapper>
// then in page.tsx add "use client" and use useQuery() or useSuspenseQuery() to fetch data
// and useMutation() to call a graphql mutaion

// See https://www.apollographql.com/docs/react/data/suspense/ for useSuspenseQuery()

import { ApolloLink, HttpLink } from "@apollo/client";
import {
    ApolloNextAppProvider,
    NextSSRApolloClient,
    NextSSRInMemoryCache,
    SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { setVerbosity } from "ts-invariant";

if (process.env.NODE_ENV === "development") {
    setVerbosity("debug");
    loadDevMessages();
    loadErrorMessages();
}

function makeClient() {
    const httpLink = new HttpLink({
        uri: process.env.NEXT_PUBLIC_API_URL,
        credentials: "include",
        // TODO: properly handle cache
        fetchOptions: { cache: "no-store" },
    });

    return new NextSSRApolloClient({
        cache: new NextSSRInMemoryCache(),
        link:
            typeof window === "undefined"
                ? ApolloLink.from([
                      new SSRMultipartLink({
                          stripDefer: true,
                      }),
                      httpLink,
                  ])
                : httpLink,
    });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
    return (
        <ApolloNextAppProvider makeClient={makeClient}>
            {children}
        </ApolloNextAppProvider>
    );
}
