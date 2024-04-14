"use client";

import { Roles } from "@/enums/roles";
import DummyQueries from "./components/DummyQueries";
import UserQueries from "./components/UserQueries";
import CodingEnvironmentQueries from "./components/CodingEnvironmentQueries";
import Divider from "@mui/material/Divider";
import { useSession } from "next-auth/react";
import * as React from "react";
import { Suspense } from "react";

export default function Dummy() {
    const { data: session } = useSession();

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="mb-64 text-center lg:max-w-5xl lg:w-full lg:grid-cols-4 lg:text-left">
                Hi Dummy Page, the environment is {process.env.NODE_ENV} and the
                graphql uri is {process.env.NEXT_PUBLIC_API_URL}
            </div>
            <div className="mb-64 text-center lg:max-w-5xl lg:w-full lg:grid-cols-4 lg:text-left">
                <Suspense fallback={<div>Loading...</div>}>
                    <DummyQueries />
                    <Divider />
                    {session?.roles?.includes(Roles.Admin) ? (
                        <>
                            <UserQueries />
                            <Divider />
                            <CodingEnvironmentQueries />
                        </>
                    ) : (
                        <div>
                            Please login as admin to access protected resources
                        </div>
                    )}
                </Suspense>
            </div>
        </main>
    );
}
