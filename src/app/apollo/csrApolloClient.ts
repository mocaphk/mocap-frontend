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
    NextSSRApolloClient,
    NextSSRInMemoryCache,
    SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import type { Session } from "next-auth";

export default function makeClient(
    accessTokenType?: Session["accessTokenType"],
    accessToken?: Session["accessToken"]
) {
    const httpLink = new HttpLink({
        uri: process.env.NEXT_PUBLIC_API_URL,
        credentials: "include",
        // TODO: properly handle cache
        fetchOptions: { cache: "no-store" },
        headers: {
            authorization:
                accessTokenType && accessToken
                    ? `${accessTokenType} ${accessToken}`
                    : "",
        },
    });

    return new NextSSRApolloClient({
        ssrMode: true,

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
