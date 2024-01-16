"use client";

import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Logout() {
    const { data: session } = useSession();

    if (!session) {
        redirect("/");
    } else {
        signOut({ callbackUrl: "/" });
    }

    return <></>;
}
