import { getServerSession } from "next-auth";
import "./globals.css";
import { Inter } from "next/font/google";
import SessionProvider from "./providers/SessionProvider";
import { authOptions } from "./api/auth/[...nextauth]/route";
import AuthProvider from "./providers/AuthProvider";
import "../../fonts/inter.css";

import ThemeRegistry from "./theme/ThemeRegistry";
import { Box } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);

    return (
        <html className={`${inter.className} h-full w-full`} lang="en">
            <body className="h-full w-full">
                {/* Provide session for client component */}
                <SessionProvider session={session}>
                    <AuthProvider>
                        <ThemeRegistry options={{ key: "mui" }}>
                            <Box className="bg-background w-full h-full">
                                {children}
                            </Box>
                        </ThemeRegistry>
                    </AuthProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
