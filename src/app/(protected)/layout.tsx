"use client";

import Box from "@mui/material/Box";

import SideMenu from "../components/SideMenu";
import TopBar from "../components/TopBar";
import TopBarPadding from "../components/TopBarPadding";
import { useSession, signIn } from "next-auth/react";

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
        <>
            <TopBar />
            {/* wrap a box so content won't cover by the SideMenu */}
            <Box sx={{ display: "flex" }}>
                <SideMenu />
                {/* some magic here min-width=0 cause the course list successfully detect flex overflow */}
                {/* the weird logic explained here: https://moduscreate.com/blog/how-to-fix-overflow-issues-in-css-flex-layouts/ */}
                <Box
                    component="main"
                    sx={{ flexGrow: 1, px: 3, py: 2 }}
                    className="min-w-0 min-h-0"
                >
                    <TopBarPadding />
                    {children}
                </Box>
            </Box>
        </>
    );
}
