import { Box, Paper, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function PaperPage({
    children,
    showBackToHome = true,
}: Readonly<{
    children: React.ReactNode;
    showBackToHome?: boolean;
}>) {
    return (
        <Box className="w-full min-h-screen flex justify-center items-center">
            <Box className="fixed left-0 top-0 m-4 flex flex-row text-center items-center space-x-3 select-none">
                <Image
                    draggable={false}
                    className="w-16"
                    src="/logo.svg"
                    alt="MOCAP Logo"
                    width={52}
                    height={52}
                    priority
                />
                <Typography variant="h5" color="secondary">
                    MOCAPHK
                </Typography>
            </Box>
            <Paper
                className="w-[500px] min-w-[400px] m-10 h-fit p-5"
                sx={{
                    borderRadius: "16px",
                }}
                elevation={24}
            >
                {children}
                {showBackToHome && (
                    <Link href="/">
                        <Typography
                            className="py-2 text-start cursor-pointer"
                            color="secondary"
                        >
                            {"< Back to Home"}
                        </Typography>
                    </Link>
                )}
            </Paper>
        </Box>
    );
}
