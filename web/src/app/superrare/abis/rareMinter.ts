export const rareMinterAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "address", name: "previousAdmin", type: "address" },
      { indexed: false, internalType: "address", name: "newAdmin", type: "address" },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "address", name: "beacon", type: "address" }],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "contractAddress", type: "address" },
      { indexed: false, internalType: "uint256", name: "limit", type: "uint256" },
    ],
    name: "ContractMintLimitSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "contractAddress", type: "address" },
      { indexed: false, internalType: "uint256", name: "minimum", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "endTimestamp", type: "uint256" },
    ],
    name: "ContractStakingMinimumSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "contractAddress", type: "address" },
      { indexed: false, internalType: "uint256", name: "limit", type: "uint256" },
    ],
    name: "ContractTxLimitSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "uint8", name: "version", type: "uint8" }],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "_contractAddress", type: "address" },
      { indexed: true, internalType: "address", name: "_seller", type: "address" },
      { indexed: true, internalType: "address", name: "_buyer", type: "address" },
      { indexed: false, internalType: "uint256", name: "_tokenIdStart", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "_tokenIdEnd", type: "uint256" },
      { indexed: false, internalType: "address", name: "_currency", type: "address" },
      { indexed: false, internalType: "uint256", name: "_price", type: "uint256" },
    ],
    name: "MintDirectSale",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "_contractAddress", type: "address" },
      { indexed: true, internalType: "address", name: "_currency", type: "address" },
      { indexed: true, internalType: "address", name: "_seller", type: "address" },
      { indexed: false, internalType: "uint256", name: "_price", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "_startTime", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "_maxMints", type: "uint256" },
      { indexed: false, internalType: "address payable[]", name: "splitRecipients", type: "address[]" },
      { indexed: false, internalType: "uint8[]", name: "splitRatios", type: "uint8[]" },
    ],
    name: "PrepareMintDirectSale",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "_root", type: "bytes32" },
      { indexed: false, internalType: "uint256", name: "_endTimestamp", type: "uint256" },
      { indexed: true, internalType: "address", name: "_contractAddress", type: "address" },
    ],
    name: "SetContractAllowListConfig",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "address", name: "implementation", type: "address" }],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "_contractAddress", type: "address" }],
    name: "getContractAllowListConfig",
    outputs: [
      {
        components: [
          { internalType: "bytes32", name: "root", type: "bytes32" },
          { internalType: "uint256", name: "endTimestamp", type: "uint256" },
        ],
        internalType: "struct IRareMinter.AllowListConfig",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_contractAddress", type: "address" }],
    name: "getContractMintLimit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_contractAddress", type: "address" },
      { internalType: "address", name: "_address", type: "address" },
    ],
    name: "getContractMintsPerAddress",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_contractAddress", type: "address" }],
    name: "getContractSellerStakingMinimum",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint256", name: "endTimestamp", type: "uint256" },
        ],
        internalType: "struct IRareMinter.StakingMinimum",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_contractAddress", type: "address" }],
    name: "getContractTxLimit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_contractAddress", type: "address" },
      { internalType: "address", name: "_address", type: "address" },
    ],
    name: "getContractTxsPerAddress",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_contractAddress", type: "address" }],
    name: "getDirectSaleConfig",
    outputs: [
      {
        components: [
          { internalType: "address", name: "seller", type: "address" },
          { internalType: "address", name: "currencyAddress", type: "address" },
          { internalType: "uint256", name: "price", type: "uint256" },
          { internalType: "uint256", name: "startTime", type: "uint256" },
          { internalType: "uint256", name: "maxMints", type: "uint256" },
          { internalType: "address payable[]", name: "splitRecipients", type: "address[]" },
          { internalType: "uint8[]", name: "splitRatios", type: "uint8[]" },
        ],
        internalType: "struct IRareMinter.DirectSaleConfig",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_networkBeneficiary", type: "address" },
      { internalType: "address", name: "_marketplaceSettings", type: "address" },
      { internalType: "address", name: "_spaceOperatorRegistry", type: "address" },
      { internalType: "address", name: "_royaltyEngine", type: "address" },
      { internalType: "address", name: "_payments", type: "address" },
      { internalType: "address", name: "_approvedTokenRegistry", type: "address" },
      { internalType: "address", name: "_stakingSettings", type: "address" },
      { internalType: "address", name: "_stakingRegistry", type: "address" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_contractAddress", type: "address" },
      { internalType: "address", name: "_currencyAddress", type: "address" },
      { internalType: "uint256", name: "_price", type: "uint256" },
      { internalType: "uint8", name: "_numMints", type: "uint8" },
      { internalType: "bytes32[]", name: "_proof", type: "bytes32[]" },
    ],
    name: "mintDirectSale",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_contractAddress", type: "address" },
      { internalType: "address", name: "_currencyAddress", type: "address" },
      { internalType: "uint256", name: "_price", type: "uint256" },
      { internalType: "uint256", name: "_startTime", type: "uint256" },
      { internalType: "uint256", name: "_maxMints", type: "uint256" },
      { internalType: "address payable[]", name: "_splitRecipients", type: "address[]" },
      { internalType: "uint8[]", name: "_splitRatios", type: "uint8[]" },
    ],
    name: "prepareMintDirectSale",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [{ internalType: "address", name: "_approvedTokenRegistry", type: "address" }],
    name: "setApprovedTokenRegistry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_root", type: "bytes32" },
      { internalType: "uint256", name: "_endTimestamp", type: "uint256" },
      { internalType: "address", name: "_contractAddress", type: "address" },
    ],
    name: "setContractAllowListConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_contractAddress", type: "address" },
      { internalType: "uint256", name: "_limit", type: "uint256" },
    ],
    name: "setContractMintLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_contractAddress", type: "address" },
      { internalType: "uint256", name: "_minimum", type: "uint256" },
      { internalType: "uint256", name: "_endTimestamp", type: "uint256" },
    ],
    name: "setContractSellerStakingMinimum",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_contractAddress", type: "address" },
      { internalType: "uint256", name: "_limit", type: "uint256" },
    ],
    name: "setContractTxLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_marketplaceSettings", type: "address" }],
    name: "setMarketplaceSettings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_networkBeneficiary", type: "address" }],
    name: "setNetworkBeneficiary",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_payments", type: "address" }],
    name: "setPayments",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_royaltyEngine", type: "address" }],
    name: "setRoyaltyEngine",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_spaceOperatorRegistry", type: "address" }],
    name: "setSpaceOperatorRegistry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newImplementation", type: "address" }],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newImplementation", type: "address" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;
