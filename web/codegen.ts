import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "https://api.rare.xyz/v1/graphql",
    documents: ["src/**/*.{ts,tsx}"],
    generates: {
        "./src/graphql/generated/": {
            preset: "client",
            plugins: [],
            presetConfig: {
                gqlTagName: "gql",
            },
        },
    },
    ignoreNoDocuments: false,
};

export default config;
