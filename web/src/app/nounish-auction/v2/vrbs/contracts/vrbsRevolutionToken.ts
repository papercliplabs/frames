export const vrbsRevolutionTokenContract = {
  address: "0x9ea7fd1B8823a271BEC99b205B6c0C56d7C3eAe9",
  abi: [
    {
      inputs: [{ internalType: "address", name: "_manager", type: "address" }],
      stateMutability: "payable",
      type: "constructor",
    },
    { inputs: [], name: "ADDRESS_ZERO", type: "error" },
    { inputs: [{ internalType: "address", name: "target", type: "address" }], name: "AddressEmptyCode", type: "error" },
    { inputs: [], name: "CULTURE_INDEX_LOCKED", type: "error" },
    { inputs: [], name: "CheckpointUnorderedInsertion", type: "error" },
    { inputs: [], name: "DESCRIPTOR_LOCKED", type: "error" },
    { inputs: [], name: "ECDSAInvalidSignature", type: "error" },
    {
      inputs: [{ internalType: "uint256", name: "length", type: "uint256" }],
      name: "ECDSAInvalidSignatureLength",
      type: "error",
    },
    {
      inputs: [{ internalType: "bytes32", name: "s", type: "bytes32" }],
      name: "ECDSAInvalidSignatureS",
      type: "error",
    },
    {
      inputs: [
        { internalType: "uint256", name: "timepoint", type: "uint256" },
        { internalType: "uint48", name: "clock", type: "uint48" },
      ],
      name: "ERC5805FutureLookup",
      type: "error",
    },
    { inputs: [], name: "ERC6372InconsistentClock", type: "error" },
    { inputs: [], name: "ERC721EnumerableForbiddenBatchMint", type: "error" },
    {
      inputs: [
        { internalType: "address", name: "sender", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "address", name: "owner", type: "address" },
      ],
      name: "ERC721IncorrectOwner",
      type: "error",
    },
    {
      inputs: [
        { internalType: "address", name: "operator", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "ERC721InsufficientApproval",
      type: "error",
    },
    {
      inputs: [{ internalType: "address", name: "approver", type: "address" }],
      name: "ERC721InvalidApprover",
      type: "error",
    },
    {
      inputs: [{ internalType: "address", name: "operator", type: "address" }],
      name: "ERC721InvalidOperator",
      type: "error",
    },
    {
      inputs: [{ internalType: "address", name: "owner", type: "address" }],
      name: "ERC721InvalidOwner",
      type: "error",
    },
    {
      inputs: [{ internalType: "address", name: "receiver", type: "address" }],
      name: "ERC721InvalidReceiver",
      type: "error",
    },
    {
      inputs: [{ internalType: "address", name: "sender", type: "address" }],
      name: "ERC721InvalidSender",
      type: "error",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "ERC721NonexistentToken",
      type: "error",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "uint256", name: "index", type: "uint256" },
      ],
      name: "ERC721OutOfBoundsIndex",
      type: "error",
    },
    { inputs: [], name: "FailedInnerCall", type: "error" },
    { inputs: [], name: "INVALID_TOKEN_ID", type: "error" },
    { inputs: [{ internalType: "address", name: "impl", type: "address" }], name: "INVALID_UPGRADE", type: "error" },
    {
      inputs: [
        { internalType: "address", name: "account", type: "address" },
        { internalType: "uint256", name: "currentNonce", type: "uint256" },
      ],
      name: "InvalidAccountNonce",
      type: "error",
    },
    { inputs: [], name: "InvalidInitialization", type: "error" },
    { inputs: [], name: "MINTER_LOCKED", type: "error" },
    { inputs: [], name: "NOT_MINTER", type: "error" },
    { inputs: [], name: "NotInitializing", type: "error" },
    { inputs: [], name: "ONLY_CALL", type: "error" },
    { inputs: [], name: "ONLY_DELEGATECALL", type: "error" },
    { inputs: [], name: "ONLY_MANAGER_CAN_INITIALIZE", type: "error" },
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
    { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
    {
      inputs: [
        { internalType: "uint8", name: "bits", type: "uint8" },
        { internalType: "uint256", name: "value", type: "uint256" },
      ],
      name: "SafeCastOverflowedUintDowncast",
      type: "error",
    },
    { inputs: [], name: "TOO_MANY_CREATORS", type: "error" },
    { inputs: [], name: "UNSUPPORTED_UUID", type: "error" },
    {
      inputs: [{ internalType: "uint256", name: "expiry", type: "uint256" }],
      name: "VotesExpiredSignature",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "address", name: "owner", type: "address" },
        { indexed: true, internalType: "address", name: "approved", type: "address" },
        { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "address", name: "owner", type: "address" },
        { indexed: true, internalType: "address", name: "operator", type: "address" },
        { indexed: false, internalType: "bool", name: "approved", type: "bool" },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    { anonymous: false, inputs: [], name: "CultureIndexLocked", type: "event" },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: "contract ICultureIndex", name: "cultureIndex", type: "address" }],
      name: "CultureIndexUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "address", name: "delegator", type: "address" },
        { indexed: true, internalType: "address", name: "fromDelegate", type: "address" },
        { indexed: true, internalType: "address", name: "toDelegate", type: "address" },
      ],
      name: "DelegateChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "address", name: "delegate", type: "address" },
        { indexed: false, internalType: "uint256", name: "previousVotes", type: "uint256" },
        { indexed: false, internalType: "uint256", name: "newVotes", type: "uint256" },
      ],
      name: "DelegateVotesChanged",
      type: "event",
    },
    { anonymous: false, inputs: [], name: "DescriptorLocked", type: "event" },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: "contract IDescriptorMinimal", name: "descriptor", type: "address" }],
      name: "DescriptorUpdated",
      type: "event",
    },
    { anonymous: false, inputs: [], name: "EIP712DomainChanged", type: "event" },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: "uint64", name: "version", type: "uint64" }],
      name: "Initialized",
      type: "event",
    },
    { anonymous: false, inputs: [], name: "MinterLocked", type: "event" },
    {
      anonymous: false,
      inputs: [{ indexed: false, internalType: "address", name: "minter", type: "address" }],
      name: "MinterUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
        { indexed: true, internalType: "address", name: "newOwner", type: "address" },
      ],
      name: "OwnershipTransferStarted",
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
      inputs: [{ indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "RevolutionTokenBurned",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
        {
          components: [
            { internalType: "uint256", name: "pieceId", type: "uint256" },
            {
              components: [
                { internalType: "address", name: "creator", type: "address" },
                { internalType: "uint256", name: "bps", type: "uint256" },
              ],
              internalType: "struct ICultureIndex.CreatorBps[]",
              name: "creators",
              type: "tuple[]",
            },
            { internalType: "address", name: "sponsor", type: "address" },
          ],
          indexed: false,
          internalType: "struct ICultureIndex.ArtPieceCondensed",
          name: "artPiece",
          type: "tuple",
        },
      ],
      name: "RevolutionTokenCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "address", name: "from", type: "address" },
        { indexed: true, internalType: "address", name: "to", type: "address" },
        { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "Transfer",
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
      name: "CLOCK_MODE",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "VotesStorageLocation",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    { inputs: [], name: "acceptOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "artPieces",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "burn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "clock",
      outputs: [{ internalType: "uint48", name: "", type: "uint48" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "contractURI",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
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
      inputs: [],
      name: "cultureIndex",
      outputs: [{ internalType: "contract ICultureIndex", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "dataURI",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "delegatee", type: "address" }],
      name: "delegate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "delegatee", type: "address" },
        { internalType: "uint256", name: "nonce", type: "uint256" },
        { internalType: "uint256", name: "expiry", type: "uint256" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "delegateBySig",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "delegates",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "descriptor",
      outputs: [{ internalType: "contract IDescriptorMinimal", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "eip712Domain",
      outputs: [
        { internalType: "bytes1", name: "fields", type: "bytes1" },
        { internalType: "string", name: "name", type: "string" },
        { internalType: "string", name: "version", type: "string" },
        { internalType: "uint256", name: "chainId", type: "uint256" },
        { internalType: "address", name: "verifyingContract", type: "address" },
        { internalType: "bytes32", name: "salt", type: "bytes32" },
        { internalType: "uint256[]", name: "extensions", type: "uint256[]" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "getApproved",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "getArtPieceById",
      outputs: [
        {
          components: [
            { internalType: "uint256", name: "pieceId", type: "uint256" },
            {
              components: [
                { internalType: "string", name: "name", type: "string" },
                { internalType: "string", name: "description", type: "string" },
                { internalType: "enum ICultureIndex.MediaType", name: "mediaType", type: "uint8" },
                { internalType: "string", name: "image", type: "string" },
                { internalType: "string", name: "text", type: "string" },
                { internalType: "string", name: "animationUrl", type: "string" },
              ],
              internalType: "struct ICultureIndex.ArtPieceMetadata",
              name: "metadata",
              type: "tuple",
            },
            {
              components: [
                { internalType: "address", name: "creator", type: "address" },
                { internalType: "uint256", name: "bps", type: "uint256" },
              ],
              internalType: "struct ICultureIndex.CreatorBps[]",
              name: "creators",
              type: "tuple[]",
            },
            { internalType: "address", name: "sponsor", type: "address" },
            { internalType: "bool", name: "isDropped", type: "bool" },
            { internalType: "uint256", name: "creationBlock", type: "uint256" },
          ],
          internalType: "struct ICultureIndex.ArtPiece",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "timepoint", type: "uint256" }],
      name: "getPastTotalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "account", type: "address" },
        { internalType: "uint256", name: "timepoint", type: "uint256" },
      ],
      name: "getPastVotes",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "getVotes",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_minter", type: "address" },
        { internalType: "address", name: "_initialOwner", type: "address" },
        { internalType: "address", name: "_descriptor", type: "address" },
        { internalType: "address", name: "_cultureIndex", type: "address" },
        {
          components: [
            { internalType: "string", name: "name", type: "string" },
            { internalType: "string", name: "symbol", type: "string" },
            { internalType: "string", name: "contractURIHash", type: "string" },
            { internalType: "string", name: "tokenNamePrefix", type: "string" },
          ],
          internalType: "struct IRevolutionBuilder.RevolutionTokenParams",
          name: "_revolutionTokenParams",
          type: "tuple",
        },
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "operator", type: "address" },
      ],
      name: "isApprovedForAll",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "isCultureIndexLocked",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "isDescriptorLocked",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "isMinterLocked",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    { inputs: [], name: "lockCultureIndex", outputs: [], stateMutability: "nonpayable", type: "function" },
    { inputs: [], name: "lockDescriptor", outputs: [], stateMutability: "nonpayable", type: "function" },
    { inputs: [], name: "lockMinter", outputs: [], stateMutability: "nonpayable", type: "function" },
    {
      inputs: [],
      name: "mint",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "minter",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "owner", type: "address" }],
      name: "nonces",
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
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "ownerOf",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "pendingOwner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
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
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "bytes", name: "data", type: "bytes" },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "operator", type: "address" },
        { internalType: "bool", name: "approved", type: "bool" },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "string", name: "newContractURIHash", type: "string" }],
      name: "setContractURIHash",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "contract ICultureIndex", name: "_cultureIndex", type: "address" }],
      name: "setCultureIndex",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "contract IDescriptorMinimal", name: "_descriptor", type: "address" }],
      name: "setDescriptor",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_minter", type: "address" }],
      name: "setMinter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
      name: "supportsInterface",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
      name: "tokenByIndex",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "uint256", name: "index", type: "uint256" },
      ],
      name: "tokenOfOwnerByIndex",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
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
    {
      inputs: [],
      name: "topVotedPieceMeetsQuorum",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "transferFrom",
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