# Contracts that are deployed for use by Paperclip Labs frame server

## Development

Install forge: https://book.getfoundry.sh/getting-started/installation

Building
```
forge build
```

Testing
```
forge test
```

Install a new dependency
```
forge install <github_name>/<repo_name> --no-commit
```

## Deployment

### Deploy contract
Base
```
source .env; forge create --rpc-url $BASE_RPC_URL --private-key $PRIVATE_KEY  src/SyndicateFrameERC721.sol:SyndicateFrameERC721
```

Base Sepiloa
```
source .env; forge create \
    --rpc-url $BASE_SEPOLIA_RPC_URL \
    --private-key $PRIVATE_KEY \
    --constructor-args <collection_name> <collection_symbol> <metadata_uri> <max_supply> \
    --verify \
    --verifier blockscout \
    --verifier-url https://base-sepolia.blockscout.com/api\? \
    src/SyndicateFrameERC721.sol:SyndicateFrameERC721
```

### Verify Contract on Blockscout
Base
```
source .env; forge verify-contract --chain-id 8453 <contract_address> --etherscan-api-key $ETHERSCAN_API_KEY src/SyndicateFrameERC721.sol:SyndicateFrameERC721   
```

Base Sepolia 
```
forge verify-contract --chain-id 84532 <contract_address> src/SyndicateFrameERC721.sol:SyndicateFrameERC721 --verifier blockscout --verifier-url https://base-sepolia.blockscout.com/api\?
```

## Register with Syndicate Frame API
```
curl --request POST \
  --url https://frame.syndicate.io/api/register \
  --header 'Authorization: Bearer <api_key>' \
  --data '{"contractAddress":"<contract_address>"}'
```
