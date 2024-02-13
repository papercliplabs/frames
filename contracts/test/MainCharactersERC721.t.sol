// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {MainCharactersERC721} from "../src/MainCharactersERC721.sol";

contract MainCharactersERC721Test is Test {
    MainCharactersERC721 public nft;
    address deployer;
    address otherUser;

    string public constant EXPECTED_NAME = "TEST_NAME";
    string public constant EXPECTED_SYMBOL = "TN";
    string public constant EXPECTED_DEFAULT_URI = "TEST_URI";
    uint256 public constant EXPECTED_MAX_SUPPLY = 100;

    function setUp() public {
        deployer = vm.addr(1);
        otherUser = vm.addr(2);

        vm.prank(deployer);
        nft = new MainCharactersERC721(EXPECTED_NAME, EXPECTED_SYMBOL, EXPECTED_DEFAULT_URI, EXPECTED_MAX_SUPPLY);
    }

    function test_Init() public {
        assertEq(nft.name(), EXPECTED_NAME);
        assertEq(nft.symbol(), EXPECTED_SYMBOL);
        assertEq(nft.defaultURI(), EXPECTED_DEFAULT_URI);
        assertEq(nft.maxSupply(), EXPECTED_MAX_SUPPLY);
        assertEq(nft.pointsRedeemer(), deployer);
    }

    function test_RedeemPoints() public {
        vm.startPrank(deployer);
        nft.mint(otherUser);
        assertFalse(nft.redeemedPoints(1));
        nft.redeemPoints(1);
        assertTrue(nft.redeemedPoints(1));
    }

    function test_SetPointsRedeemer() public {
        vm.startPrank(deployer);
        nft.setPointsRedeemer(otherUser);
        assertEq(nft.pointsRedeemer(), otherUser);
    }

    function testFail_RedeemPoints() public {
        vm.prank(deployer);
        nft.mint(otherUser);
        assertFalse(nft.redeemedPoints(1));

        // Expect revert since not redeemer
        vm.prank(otherUser);
        nft.redeemPoints(1);
    }

    function testFail_SetPointRedeemer() public {
        // Revert since not owner
        vm.prank(otherUser);
        nft.setPointsRedeemer(otherUser);
    }

    function testFail_DoubleRedemption() public {
        vm.startPrank(deployer);
        nft.mint(otherUser);
        assertFalse(nft.redeemedPoints(1));
        nft.redeemPoints(1);
        assertTrue(nft.redeemedPoints(1));

        // Expect revert here, since we already redeemed
        nft.redeemPoints(1);
    }
}
