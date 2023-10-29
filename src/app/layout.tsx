import { getServerSession } from "next-auth";
import "./globals.css";
import { Inter } from "next/font/google";
import SessionProvider from "./providers/SessionProvider";
import { authOptions } from "./api/auth/[...nextauth]/route";
import AuthProvider from "./providers/AuthProvider";

import ThemeRegistry from "./theme/ThemeRegistry";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    return (
        <html lang="en">
            <body className={inter.className}>
                {/* Provide session for client component */}
                <SessionProvider session={session}>
                    <AuthProvider>
                        <ThemeRegistry options={{ key: "mui" }}>
                            {children}
                        </ThemeRegistry>
                    </AuthProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
