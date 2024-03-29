export const auctionAbi = [
  {
    inputs: [],
    name: "auction",
    outputs: [
      { internalType: "uint256", name: "nounId", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "startTime", type: "uint256" },
      { internalType: "uint256", name: "endTime", type: "uint256" },
      { internalType: "address payable", name: "bidder", type: "address" },
      { internalType: "bool", name: "settled", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
