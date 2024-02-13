// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {ERC721} from "../lib/openzeppelin-contracts/contracts/token/ERC721//ERC721.sol";
import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract SyndicateFrameERC721 is ERC721, Ownable {
    ////
    // Storage
    ////
    string public defaultURI;
    mapping(uint256 tokenId => string tokenURI) public tokenURIs;
    mapping(uint256 tokenId => bool locked) public lockedTokenURIs;

    uint256 public currentTokenId = 0;
    uint256 public maxSupply;
    uint256 public maxMintPerAddress;
    mapping(address authorizedMinter => bool authorized) public authorizedMinters;
    mapping(address minted => uint256 count) public mintCount;

    ////
    // Events
    ////
    event DefaultTokenURISet(string tokenURI);
    event TokenURISet(uint256 indexed tokenId, string tokenURI);
    event TokenURILocked(uint256 indexed tokenId);
    event AuthorizedMinterSet(address indexed minter, bool authorized);

    ////
    // Modifiers
    ////
    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender], "FrameNFTs: Mint must be triggered by API");
        _;
    }

    modifier onlyUnlockedTokenURI(uint256 tokenId) {
        require(!lockedTokenURIs[tokenId], "FrameNFTs: Token URI is locked");
        _;
    }

    modifier onlyBelowMaxMint(address to) {
        require(mintCount[to] < maxMintPerAddress, "FrameNFTs: Max mint reached");
        _;
    }

    modifier notSoldOut() {
        require(currentTokenId < maxSupply, "FrameNFTs: Max supply reached");
        _;
    }

    ////
    // Constructor
    ////
    constructor(string memory name, string memory symbol, string memory _defaultUri, uint256 _maxSupply)
        ERC721(name, symbol)
        Ownable(msg.sender)
    {
        defaultURI = _defaultUri;
        maxSupply = _maxSupply;
        maxMintPerAddress = 1;

        // The deployer is set as an authorized minter, allowing them to set up
        // owner mints manually via the contract as needed
        authorizedMinters[msg.sender] = true;
        emit AuthorizedMinterSet(msg.sender, true);

        // Authorize Syndicate's API-based wallet pool as a minter on Base Mainnet
        authorizeBaseMainnetSyndicateAPI();
    }

    ////
    // Public write functions
    ////
    function mint(address to) public onlyAuthorizedMinter notSoldOut onlyBelowMaxMint(to) {
        ++currentTokenId;
        ++mintCount[to];
        _mint(to, currentTokenId);
    }

    function mint(address to, string memory _tokenURI) public onlyAuthorizedMinter notSoldOut onlyBelowMaxMint(to) {
        ++currentTokenId;
        ++mintCount[to];
        tokenURIs[currentTokenId] = _tokenURI;
        _mint(to, currentTokenId);

        emit TokenURISet(currentTokenId, _tokenURI);
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI)
        public
        onlyAuthorizedMinter
        onlyUnlockedTokenURI(tokenId)
    {
        tokenURIs[tokenId] = _tokenURI;

        emit TokenURISet(tokenId, _tokenURI);
    }

    function lockTokenURI(uint256 tokenId) public onlyOwner {
        lockedTokenURIs[tokenId] = true;

        emit TokenURILocked(tokenId);
    }

    function setDefaultTokenURI(string memory _tokenURI) public onlyOwner {
        defaultURI = _tokenURI;
        emit DefaultTokenURISet(_tokenURI);
    }

    function setMaxMintPerAddress(uint256 _maxMintPerAddress) public onlyOwner {
        maxMintPerAddress = _maxMintPerAddress;
    }

    function setAuthorizedMinter(address minter, bool authorized) public onlyOwner {
        authorizedMinters[minter] = authorized;

        emit AuthorizedMinterSet(minter, authorized);
    }

    function setMaxSupply(uint256 _maxSupply) public onlyOwner {
        maxSupply = _maxSupply;
    }

    ////
    // View
    ////
    function tokenURI(uint256 tokenId) public view virtual override(ERC721) returns (string memory) {
        if (bytes(tokenURIs[tokenId]).length > 0) {
            return tokenURIs[tokenId];
        } else {
            return defaultURI;
        }
    }

    ////
    // Private functions
    ////
    function authorizeBaseMainnetSyndicateAPI() internal {
        authorizedMinters[0x3D0263e0101DE2E9070737Df30236867485A5208] = true;
        authorizedMinters[0x98407Cb54D8dc219d8BF04C9018B512dDbB96caB] = true;
        authorizedMinters[0xF43A72c1a41b7361728C83699f69b5280161F0A5] = true;
        authorizedMinters[0x94702712BA81C0D065665B8b0312D87B190EbA37] = true;
        authorizedMinters[0x10FD71C6a3eF8F75d65ab9F3d77c364C321Faeb5] = true;

        emit AuthorizedMinterSet(0x3D0263e0101DE2E9070737Df30236867485A5208, true);
        emit AuthorizedMinterSet(0x98407Cb54D8dc219d8BF04C9018B512dDbB96caB, true);
        emit AuthorizedMinterSet(0xF43A72c1a41b7361728C83699f69b5280161F0A5, true);
        emit AuthorizedMinterSet(0x94702712BA81C0D065665B8b0312D87B190EbA37, true);
        emit AuthorizedMinterSet(0x10FD71C6a3eF8F75d65ab9F3d77c364C321Faeb5, true);
    }
}
