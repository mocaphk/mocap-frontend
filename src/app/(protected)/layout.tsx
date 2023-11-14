import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Box from "@mui/material/Box";

import SideMenu from "../components/SideMenu";
import TopBar from "../components/TopBar";
import TopBarPadding from "../components/TopBarPadding";

export default async function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
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
