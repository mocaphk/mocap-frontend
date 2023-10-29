import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Box from "@mui/material/Box";

import SideMenu from "../components/SideMenu";
import TopBar from "../components/TopBar";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
                {/* hardcode some padding for stuff to appear under the TopBar, may need to fix later */}
                <Box component="main" sx={{ flexGrow: 1, px: 3, pt: 10 }}>
                    {children}
                </Box>
            </Box>
        </>
    );
}
