export const tokenAbi = [
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "seeds",
    outputs: [
      { internalType: "uint48", name: "background", type: "uint48" },
      { internalType: "uint48", name: "body", type: "uint48" },
      { internalType: "uint48", name: "accessory", type: "uint48" },
      { internalType: "uint48", name: "head", type: "uint48" },
      { internalType: "uint48", name: "glasses", type: "uint48" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
