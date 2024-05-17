export const nounsBuilderMetadataAbi = [
  {
    inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
    name: "getAttributes",
    outputs: [
      { internalType: "string", name: "resultAttributes", type: "string" },
      { internalType: "string", name: "queryString", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
