"use client";

import Box from "@mui/material/Box";

import SideMenu from "../components/SideMenu";
import TopBar from "../components/TopBar";
import TopBarPadding from "../components/TopBarPadding";
import { useSession, signIn } from "next-auth/react";
import ApolloProvider from "../providers/ApolloProvider";

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: session } = useSession();

    if (!session) {
        signIn("keycloak");
        return <></>;
    }

    return (
        <ApolloProvider>
            <TopBar />
            {/* wrap a box so content won't cover by the SideMenu */}
            <Box className="flex min-h-screen">
                <SideMenu />
                {/* some magic here min-width=0 cause the course list successfully detect flex overflow */}
                {/* the weird logic explained here: https://moduscreate.com/blog/how-to-fix-overflow-issues-in-css-flex-layouts/ */}
                <Box
                    className="flex flex-col min-w-0 min-h-screen w-full px-3 py-2"
                    component="main"
                >
                    <TopBarPadding />
                    {children}
                </Box>
            </Box>
        </ApolloProvider>
    );
}
