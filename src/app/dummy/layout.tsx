import { ApolloWrapper } from "../api/apollo-wrapper";

export default function DummyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ApolloWrapper>{children}</ApolloWrapper>;
}
