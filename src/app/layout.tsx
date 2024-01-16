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
        <html className={`${inter.className} bg-background`} lang="en">
            <head>
                <title>Mocap</title>
                <meta
                    name="description"
                    content="MOCAP offers a pre-configured coding environment accessible through the web platform, eliminating the need for individual local machine configurations."
                ></meta>
                <meta name="author" content="mocap"></meta>
            </head>
            <body>
                {/* Provide session for client component */}
                <SessionProvider session={session}>
                    <AuthProvider>
                        <ThemeRegistry options={{ key: "mui" }}>
                            <Box className="bg-background min-h-screen">
                                {children}
                            </Box>
                        </ThemeRegistry>
                    </AuthProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
