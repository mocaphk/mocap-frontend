"use client";

import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { capitalizeAllWords, camelToSpace } from "./utils/string";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    React.useEffect(() => {
        const paths = pathname.split("/");
        const firstPath = paths[1];
        document.title = firstPath
            ? capitalizeAllWords(camelToSpace(firstPath))
            : "Mocap";
    }, [pathname, searchParams]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            {children}
        </LocalizationProvider>
    );
}
