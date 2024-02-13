// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {SyndicateFrameERC721} from "./SyndicateFrameERC721.sol";

contract MainCharactersERC721 is SyndicateFrameERC721 {
    ////
    // Storage
    ////
    address public pointsRedeemer;
    mapping(uint256 tokenId => bool redeemed) public redeemedPoints;

    ////
    // Events
    ////
    event PointsRedeemerSet(address indexed previousPointsRedeemer, address indexed newPointsRedeemer);
    event PointsRedeemed(uint256 indexed tokenId);

    ////
    // Modifiers
    ////
    modifier onlyPointsRedeemer() {
        require(msg.sender == pointsRedeemer, "MainCharactersNFT: Must be points redeemer");
        _;
    }

    ////
    // Constructor
    ////
    constructor(string memory name, string memory symbol, string memory _defaultUri, uint256 _maxSupply)
        SyndicateFrameERC721(name, symbol, _defaultUri, _maxSupply)
    {
        pointsRedeemer = msg.sender;
        emit PointsRedeemerSet(address(0), msg.sender);
    }

    ////
    // Public write functions
    ////
    function redeemPoints(uint256 tokenId) public onlyPointsRedeemer {
        require(redeemedPoints[tokenId] == false, "MainCharactersNFT: Points already redeemed");
        redeemedPoints[tokenId] = true;
        emit PointsRedeemed(tokenId);
    }

    function setPointsRedeemer(address newPointsRedeemer) public onlyOwner {
        address oldPointsRedeemer = pointsRedeemer;
        pointsRedeemer = newPointsRedeemer;
        emit PointsRedeemerSet(oldPointsRedeemer, newPointsRedeemer);
    }
}
