"use client";

import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { capitalizeFirstLetter } from "./utils/string";

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    React.useEffect(() => {
        const paths = pathname.split("/");
        const firstPath = paths[1];
        document.title = firstPath ? capitalizeFirstLetter(firstPath) : "Mocap";
    }, [pathname, searchParams]);

    return children;
}
