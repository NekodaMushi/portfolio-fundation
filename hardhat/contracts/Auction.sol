// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract Auction {

	// Event that will be fire to the smart contract `logs`
	// Useful for notify and communicate to outside parts of the Blockchain
	event Start();
	event End(address highestBidder, uint highestBid);
	event Bid(address indexed sender, uint amount);
	event Withdraw(address indexed bidder, uint amount);


	address payable public seller;
	bool public started; 
	bool public ended;
	uint public endAt;

	uint public highestBid;
	address public highestBidder;

	// mapping is a key/value map. like hashtables
	// mapping the corresponding bids to corresponding addresses
	mapping(address => uint) public bids;

	/* contract initialization called by lauch by `constructor`, only once */
	constructor() {
		seller = payable(msg.sender);
	}

	// Function for starting an auction
	function start(uint startingBid) external {
		require(!started, "already running");
		require(msg.sender == seller, "you did not start the auction cheater!");
		started = true;
		endAt = block.timestamp + 10 days;
		highestBid = startingBid;
		emit Start();
	}

	// Function for placing a bid
	// "require" used for evaluate certains conditions, took a Boolean as parameter
	function bid() external payable {
		require(started, "Not started yet this auction");
		require(block.timestamp < endAt, "Ended");
		require(msg.value > highestBid);

		if (highestBidder != address(0)) {
			bids[highestBidder] += highestBid;
		}

		highestBid = msg.value;
		highestBidder = msg.sender;

		emit Bid(highestBidder, highestBid);
	}


	// Function to "refund" to overbidded users, give them the ability to "withdraw"
	// the money they engage 
	function withdraw() external payable {
		uint bal = bids[msg.sender];
		bids[msg.sender] = 0;
		(bool sent, ) = payable(msg.sender).call{value: bal}("");
		require(sent, "withdraw crashed");

		emit Withdraw(msg.sender, bal);
	}

	// basically end the auction. Only the owner of auction product can call it 
	function end() external {
		require(started, "need to start before!");
		require(block.timestamp >= endAt, "Auction is still ongoing");
		require(!ended, "Auction already ended!");
		ended = true;
		emit End(highestBidder, highestBid);
	}
}

