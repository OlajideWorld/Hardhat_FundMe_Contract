// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "contracts/PriceConverter.sol";

error UnAuthorized();

/// @author Rutedor @olajideWorld - Blockchain developer
/// @title A Crowd-Funding Contract for Blockchain Enthusiast

contract Fundme {
    // Some NAT-SPEC FORMAT FOR YOUR SOLIDITY CODES

    /// @title A simulator for trees
    /// @author Larry A. Gardner
    /// @notice You can use this contract for only the most basic simulation
    /// @dev All function calls are currently implemented without side effects
    /// @custom:experimental This is an experimental contract.
    /// @return Age in years, rounded up for partial years
    /// @param rings The number of rings from dendrochronological sample
    /// @inheritdoc Tree
    /** made by OlajideWord */
    using PriceConverter for uint256;

    address private immutable Owner;

    uint256 constant MINIMUM_AMOUNT = 50 * 1e18;

    mapping(address => uint256) public funderToAmountFunded;

    address[] public fundersList;

    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {
        Owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    modifier checkOwner() {
        // require(msg.sender == Owner, "You cannot get the funds");
        if (msg.sender != Owner) {
            revert UnAuthorized();
        }
        _;
    }

    function fund() public payable {
        require(
            msg.value.getConverter(priceFeed) >= MINIMUM_AMOUNT,
            "Sorry the minimum amount is 50 USD"
        );
        funderToAmountFunded[msg.sender] = msg.value;
        fundersList.push(msg.sender);
    }

    function withdraw() public checkOwner {
        for (uint i = 0; i < fundersList.length; i++) {
            address funderDetails = fundersList[i];
            funderToAmountFunded[funderDetails] = 0;
        }

        fundersList = new address[](0);

        // Transfer Method (not recommended)
        // payable(msg.sender).transfer(address(this).balance);

        // Send Method (not recommended)
        // bool success = payable(msg.sender).send(address(this).balance);

        // Call Method
        (bool callsuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callsuccess, "Unable to send to address");
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}
