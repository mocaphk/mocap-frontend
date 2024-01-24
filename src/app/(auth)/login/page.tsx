"use client";

import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Login() {
    const { data: session } = useSession();

    if (!session) {
        signIn("keycloak");
    } else {
        redirect("/home");
    }

    return <></>;
}
