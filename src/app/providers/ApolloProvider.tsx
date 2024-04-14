"use client";

import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { ApolloNextAppProvider } from "@apollo/experimental-nextjs-app-support/ssr";
import { setVerbosity } from "ts-invariant";
import makeClient from "../apollo/csrApolloClient";

if (process.env.NODE_ENV === "development") {
    setVerbosity("debug");
    loadDevMessages();
    loadErrorMessages();
}

export default function ApolloProvider({ children }: React.PropsWithChildren) {
    return (
        <ApolloNextAppProvider makeClient={() => makeClient()}>
            {children}
        </ApolloNextAppProvider>
    );
}
