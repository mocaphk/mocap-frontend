"use client";

import PaperPage from "@/app/components/PaperPage";
import { Alert } from "@mui/material";
import { useSearchParams } from "next/navigation";

export default function AuthError() {
    const searchParams = useSearchParams();

    const errorCode = searchParams.get("error");

    return (
        <PaperPage>
            <Alert className="w-full" severity="error">
                An error occurred while authenticating.
                {errorCode && ` Error Code: ${errorCode}`}
            </Alert>
        </PaperPage>
    );
}
