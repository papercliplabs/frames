export const tokenAbi = [
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "seeds",
    outputs: [
      { internalType: "uint256", name: "classOne", type: "uint256" },
      { internalType: "uint256", name: "classTwo", type: "uint256" },
      { internalType: "uint256", name: "size", type: "uint256" },
      { internalType: "uint256", name: "helmetLib", type: "uint256" },
      { internalType: "uint256", name: "helmet", type: "uint256" },
      { internalType: "uint256", name: "gearLib", type: "uint256" },
      { internalType: "uint256", name: "gear", type: "uint256" },
      { internalType: "uint256", name: "vibe", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "descriptor",
    outputs: [{ internalType: "address", name: "descriptor", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
