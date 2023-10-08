// run `npm run compile` to generate the types of the graphql queries and mutations

import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    // TODO: change to server graphql endpoint
    schema: "http://localhost:8080/graphql",
    documents: ["src/**/*.{ts,tsx}"],
    generates: {
        "./src/__generated__/": {
            preset: "client",
            plugins: [],
            presetConfig: {
                gqlTagName: "gql",
            },
        },
    },
    ignoreNoDocuments: true,
};

export default config;
