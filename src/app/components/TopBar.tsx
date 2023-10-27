"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

function AuthButton() {
    const { data: session } = useSession();
    const pathname = usePathname();

    if (session) {
        return (
            <>
                {session?.user?.name} <br />
                <button onClick={() => signOut({ callbackUrl: "/" })}>
                    Sign out
                </button>
            </>
        );
    }

    return (
        <>
            Not signed in <br />
            <button
                onClick={() => {
                    if (pathname == "/") {
                        signIn("keycloak", { callbackUrl: "/home" });
                    } else {
                        signIn("keycloak");
                    }
                }}
            >
                Sign in
            </button>
        </>
    );
}

function TopBar() {
    return <AuthButton />;
}

export default TopBar;
