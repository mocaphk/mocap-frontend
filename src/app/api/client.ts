// Server Components
// https://www.apollographql.com/blog/announcement/frontend/using-apollo-client-with-next-js-13-releasing-an-official-library-to-support-the-app-router/

// Server Components allow you to run data fetching on the server, removing
// the need for client-side fetches in most cases, however, server components
// must be manually refreshed when data changes, for example as a result of
// a graphql mutation. So if the same data would be displayed or used in
// both environments, it would quickly run out of sync and result in inconsistencies.

// Use it like this to fetch data: const data = await getClient().query(...)
// or like this to call a graphql mutaion: const data = await getClient().mutate(...)

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { setVerbosity } from "ts-invariant";

if (process.env.NODE_ENV === "development") {
    setVerbosity("debug");
    loadDevMessages();
    loadErrorMessages();
}

export const { getClient } = registerApolloClient(() => {
    const httpLink = new HttpLink({
        uri: process.env.NEXT_PUBLIC_API_URL,
        credentials: "include",
        // TODO: properly handle cache
        fetchOptions: { cache: "no-store" },
    });

    return new ApolloClient({
        cache: new InMemoryCache(),
        link: httpLink,
    });
});
