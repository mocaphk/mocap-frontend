"use client";

import { signOut, useSession } from "next-auth/react";

export default function AuthProvider({ children }: React.PropsWithChildren) {
    const { data: session } = useSession();

    if (session?.error) {
        signOut();
    }

    return <>{children}</>;
}
