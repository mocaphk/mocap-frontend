import DummyQueries from "./components/dummyQueries";
import { Suspense } from "react";

export default function Dummy() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="mb-64 text-center lg:max-w-5xl lg:w-full lg:grid-cols-4 lg:text-left">
                Hi Dummy Page, the environment is {process.env.NODE_ENV} and the
                graphql uri is {process.env.NEXT_PUBLIC_API_URL}
            </div>
            <div className="mb-64 text-center lg:max-w-5xl lg:w-full lg:grid-cols-4 lg:text-left">
                <Suspense fallback={<div>Loading...</div>}>
                    <DummyQueries />
                </Suspense>
            </div>
        </main>
    );
}
