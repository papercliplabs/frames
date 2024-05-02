import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://api.rare.xyz/v1/graphql",
  documents: ["src/app/superrare/data/**/*.{ts,tsx}"],
  generates: {
    "./src/app/superrare/data/generated/": {
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
