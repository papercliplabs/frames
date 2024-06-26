export const vrbsAuctionHouseContract = {
  address: "0x4153b0310354B189E18797D5d7Dfda2C924bdC3D",
  abi: [
    {
      inputs: [
        { internalType: "address", name: "_manager", type: "address" },
        { internalType: "address", name: "_protocolRewards", type: "address" },
        { internalType: "address", name: "_protocolFeeRecipient", type: "address" },
      ],
      stateMutability: "payable",
      type: "constructor",
    },
    { inputs: [], name: "ADDRESS_ZERO", type: "error" },
    { inputs: [], name: "AUCTION_ALREADY_IN_PROGRESS", type: "error" },
    { inputs: [], name: "AUCTION_ALREADY_SETTLED", type: "error" },
    { inputs: [], name: "AUCTION_EXPIRED", type: "error" },
    { inputs: [], name: "AUCTION_NOT_BEGUN", type: "error" },
    { inputs: [], name: "AUCTION_NOT_COMPLETED", type: "error" },
    { inputs: [{ internalType: "address", name: "target", type: "address" }], name: "AddressEmptyCode", type: "error" },
    { inputs: [], name: "BELOW_RESERVE_PRICE", type: "error" },
    { inputs: [], name: "BID_TOO_LOW", type: "error" },
    { inputs: [], name: "CREATOR_RATE_TOO_LOW", type: "error" },
    { inputs: [], name: "EnforcedPause", type: "error" },
    { inputs: [], name: "ExpectedPause", type: "error" },
    { inputs: [], name: "FailedInnerCall", type: "error" },
    { inputs: [], name: "INSUFFICIENT_GAS_FOR_AUCTION", type: "error" },
    { inputs: [], name: "INVALID_BPS", type: "error" },
    { inputs: [], name: "INVALID_TOKEN_ID", type: "error" },
    { inputs: [{ internalType: "address", name: "impl", type: "address" }], name: "INVALID_UPGRADE", type: "error" },
    { inputs: [], name: "InvalidInitialization", type: "error" },
    { inputs: [], name: "MANIFESTO_TOO_LONG", type: "error" },
    { inputs: [], name: "MIN_CREATOR_RATE_ABOVE_CREATOR_RATE", type: "error" },
    { inputs: [], name: "MIN_CREATOR_RATE_NOT_INCREASED", type: "error" },
    { inputs: [], name: "NOT_INITIAL_TOKEN_OWNER", type: "error" },
    { inputs: [], name: "NOT_MANAGER", type: "error" },
    { inputs: [], name: "NotInitializing", type: "error" },
    { inputs: [], name: "ONLY_CALL", type: "error" },
    { inputs: [], name: "ONLY_DELEGATECALL", type: "error" },
    { inputs: [], name: "ONLY_PROXY", type: "error" },
    { inputs: [], name: "ONLY_UUPS", type: "error" },
    {
      inputs: [{ internalType: "address", name: "owner", type: "address" }],
      name: "OwnableInvalidOwner",
      type: "error",
    },
    {
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "OwnableUnauthorizedAccount",
      type: "error",
    },
    { inputs: [], name: "QUORUM_NOT_MET", type: "error" },
    { inputs: [], name: "RESERVE_PRICE_INVALID", type: "error" },
    { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
    { inputs: [], name: "UNSUPPORTED_UUID", type: "error" },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
        { indexed: false, internalType: "address", name: "bidder", type: "address" },
        { indexed: false, internalType: "address", name: "sender", type: "address" },
        { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
        { indexed: false, internalType: "bool", name: "extended", type: "bool" },
      ],
      name: "AuctionBid",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
        { indexed: false, internalType: "uint256", name: "startTime", type: "uint256" },
        { indexed: false, internalType: "uint256", name: "endTime", type: "uint256" },
      ],
      name: "AuctionCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
        { indexed: false, internalType: "uint256", name: "endTime", type: "uint256" },
      ],
      name: "AuctionExtended",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: "uint256", name: "minBidIncrementPercentage", type: "uint256" }],
      name: "AuctionMinBidIncrementPercentageUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: "uint256", name: "reservePrice", type: "uint256" }],
      name: "AuctionReservePriceUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
        { indexed: false, internalType: "address", name: "winner", type: "address" },
        { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
        { indexed: false, internalType: "uint256", name: "pointsPaidToCreators", type: "uint256" },
        { indexed: false, internalType: "uint256", name: "ethPaidToCreators", type: "uint256" },
      ],
      name: "AuctionSettled",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: "uint256", name: "timeBuffer", type: "uint256" }],
      name: "AuctionTimeBufferUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: "uint256", name: "rateBps", type: "uint256" }],
      name: "CreatorRateBpsUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: "uint256", name: "rateBps", type: "uint256" }],
      name: "EntropyRateBpsUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: "address", name: "grants", type: "address" }],
      name: "GrantsAddressUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: "uint256", name: "rateBps", type: "uint256" }],
      name: "GrantsRateBpsUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: "uint64", name: "version", type: "uint64" }],
      name: "Initialized",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
        { indexed: false, internalType: "address", name: "member", type: "address" },
        { indexed: false, internalType: "string", name: "speech", type: "string" },
      ],
      name: "ManifestoUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: "uint256", name: "rateBps", type: "uint256" }],
      name: "MinCreatorRateBpsUpdated",
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
      inputs: [{ indexed: false, internalType: "address", name: "account", type: "address" }],
      name: "Paused",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: "address", name: "account", type: "address" }],
      name: "Unpaused",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: "address", name: "impl", type: "address" }],
      name: "Upgraded",
      type: "event",
    },
    {
      inputs: [],
      name: "MIN_TOKEN_MINT_GAS_THRESHOLD",
      outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "WETH",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "auction",
      outputs: [
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "uint256", name: "amount", type: "uint256" },
        { internalType: "uint256", name: "startTime", type: "uint256" },
        { internalType: "uint256", name: "endTime", type: "uint256" },
        { internalType: "address payable", name: "bidder", type: "address" },
        { internalType: "address payable", name: "referral", type: "address" },
        { internalType: "bool", name: "settled", type: "bool" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "auctions",
      outputs: [
        { internalType: "uint256", name: "amount", type: "uint256" },
        { internalType: "address", name: "winner", type: "address" },
        { internalType: "uint256", name: "amountPaidToOwner", type: "uint256" },
        { internalType: "uint256", name: "settledBlockWad", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "paymentAmountWei", type: "uint256" }],
      name: "computePurchaseRewards",
      outputs: [
        {
          components: [
            { internalType: "uint256", name: "builderReferralReward", type: "uint256" },
            { internalType: "uint256", name: "purchaseReferralReward", type: "uint256" },
            { internalType: "uint256", name: "deployerReward", type: "uint256" },
            { internalType: "uint256", name: "revolutionReward", type: "uint256" },
          ],
          internalType: "struct IRewardSplits.RewardsSettings",
          name: "",
          type: "tuple",
        },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "paymentAmountWei", type: "uint256" }],
      name: "computeTotalReward",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [],
      name: "contractVersion",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "address", name: "bidder", type: "address" },
        { internalType: "address", name: "referral", type: "address" },
      ],
      name: "createBid",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "creatorRateBps",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "duration",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "entropyRateBps",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "getPastAuction",
      outputs: [
        {
          components: [
            { internalType: "uint256", name: "amount", type: "uint256" },
            { internalType: "address", name: "winner", type: "address" },
            { internalType: "uint256", name: "amountPaidToOwner", type: "uint256" },
            { internalType: "uint256", name: "settledBlockWad", type: "uint256" },
          ],
          internalType: "struct IAuctionHouse.AuctionHistory",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "grantsAddress",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "grantsRateBps",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_revolutionToken", type: "address" },
        { internalType: "address", name: "_revolutionPointsEmitter", type: "address" },
        { internalType: "address", name: "_initialOwner", type: "address" },
        { internalType: "address", name: "_weth", type: "address" },
        {
          components: [
            { internalType: "uint256", name: "timeBuffer", type: "uint256" },
            { internalType: "uint256", name: "reservePrice", type: "uint256" },
            { internalType: "uint256", name: "duration", type: "uint256" },
            { internalType: "uint8", name: "minBidIncrementPercentage", type: "uint8" },
            { internalType: "uint256", name: "creatorRateBps", type: "uint256" },
            { internalType: "uint256", name: "entropyRateBps", type: "uint256" },
            { internalType: "uint256", name: "minCreatorRateBps", type: "uint256" },
            {
              components: [
                { internalType: "uint256", name: "totalRateBps", type: "uint256" },
                { internalType: "address", name: "grantsAddress", type: "address" },
              ],
              internalType: "struct IRevolutionBuilder.GrantsParams",
              name: "grantsParams",
              type: "tuple",
            },
          ],
          internalType: "struct IRevolutionBuilder.AuctionParams",
          name: "_auctionParams",
          type: "tuple",
        },
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "manager",
      outputs: [{ internalType: "contract IUpgradeManager", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "manifestos",
      outputs: [
        { internalType: "address", name: "member", type: "address" },
        { internalType: "string", name: "speech", type: "string" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "minBidIncrementPercentage",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "minCreatorRateBps",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    { inputs: [], name: "pause", outputs: [], stateMutability: "nonpayable", type: "function" },
    {
      inputs: [],
      name: "paused",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
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
      inputs: [],
      name: "reservePrice",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "revolutionPointsEmitter",
      outputs: [{ internalType: "contract IRevolutionPointsEmitter", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "revolutionToken",
      outputs: [{ internalType: "contract IRevolutionToken", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_creatorRateBps", type: "uint256" }],
      name: "setCreatorRateBps",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_entropyRateBps", type: "uint256" }],
      name: "setEntropyRateBps",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_grantsAddress", type: "address" }],
      name: "setGrantsAddress",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_grantsRateBps", type: "uint256" }],
      name: "setGrantsRateBps",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint8", name: "_minBidIncrementPercentage", type: "uint8" }],
      name: "setMinBidIncrementPercentage",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_minCreatorRateBps", type: "uint256" }],
      name: "setMinCreatorRateBps",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_reservePrice", type: "uint256" }],
      name: "setReservePrice",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_timeBuffer", type: "uint256" }],
      name: "setTimeBuffer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    { inputs: [], name: "settleAuction", outputs: [], stateMutability: "nonpayable", type: "function" },
    {
      inputs: [],
      name: "settleCurrentAndCreateNewAuction",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "timeBuffer",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    { inputs: [], name: "unpause", outputs: [], stateMutability: "nonpayable", type: "function" },
    {
      inputs: [
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "string", name: "newSpeech", type: "string" },
      ],
      name: "updateManifesto",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_newImpl", type: "address" }],
      name: "upgradeTo",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_newImpl", type: "address" },
        { internalType: "bytes", name: "_data", type: "bytes" },
      ],
      name: "upgradeToAndCall",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
  ],
} as const;
