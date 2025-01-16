// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "contracts/PriceConverter.sol";

error Fundme__UnAuthorized();

error Fundme__InsufficientFund();

error Fundme__FailedTransfer();

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

    mapping(address => uint256) private funderToAmountFunded;

    address[] private fundersList;

    AggregatorV3Interface private priceFeed;

    constructor(address priceFeedAddress) {
        Owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    modifier checkOwner() {
        // require(msg.sender == Owner, "You cannot get the funds");
        if (msg.sender != Owner) {
            revert Fundme__UnAuthorized();
        }
        _;
    }

    function fund() public payable {
        // require(
        //     msg.value.getConverter(priceFeed) >= MINIMUM_AMOUNT,
        //     "Sorry the minimum amount is 50 USD"
        // );
        if (msg.value.getConverter(priceFeed) < MINIMUM_AMOUNT) {
            revert Fundme__InsufficientFund();
        }
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

    /// @notice this is a much cheaper gas friendly withdraw() function
    function cheaperWithdraw() public checkOwner {
        address[] memory fundersNew = fundersList;

        for (uint i = 0; i < fundersNew.length; i++) {
            address peopleFunded = fundersNew[i];
            funderToAmountFunded[peopleFunded] = 0;
        }

        fundersList = new address[](0);

        (bool callsuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");

        if (!callsuccess) {
            revert Fundme__FailedTransfer();
        }
    }

    // view and pure functions

    /// @notice you can use this function to get the Owner
    function getOwner() public view returns (address) {
        return Owner;
    }

    /// @notice you can use this function to get the Amount funded by an address
    function getFundersAmount(
        address userAddress
    ) public view returns (uint256) {
        return funderToAmountFunded[userAddress];
    }

    /// @notice you can use this function to get all the funders of the contract
    function getfunders() public view returns (address[] memory) {
        return fundersList;
    }

    /// @notice you can use this function to get a single Funder address in the List
    function getFunder(uint256 index) public view returns (address) {
        return fundersList[index];
    }

    /// @notice you can use this function to get the priceFeed contract address
    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return priceFeed;
    }
}
