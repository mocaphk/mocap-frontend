import ApolloProvider from "../providers/ApolloProvider";

export default function DummyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ApolloProvider>{children}</ApolloProvider>;
}
