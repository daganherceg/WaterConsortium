pragma solidity ^0.6.2;

contract Ownable {
	address private owner;
	address[] private additionalOwners; // important for large orgs

	constructor() public {
		owner = msg.sender;
	}

	/**
	 * Reverts of included functions are modified by non Token addresses
	 */

	modifier isOwner() {
		bool isOwner = false;
		if (msg.sender == owner) {
			isOwner = true;
		}
		if (!isOwner) {
			for (uint i = 0; i < additionalOwners.length; i++) {
				if (additionalOwners[i] == msg.sender) {
					isOwner = true;
					break;
				}
			}
		}
		require(isOwner, "You are not a Token owner!");
		_;
	}

	function getOwner() public view returns(address) {
		return owner;
	}

	function addAdditionalOwner(address _addr) isOwner() public {
		additionalOwners.push(_addr);
	}

	function getAdditionalOwnersLength() public view returns(uint) {
		return additionalOwners.length;
	}

	function getAdditionalOwner(uint _index) public view returns(address) {
		return additionalOwners[_index];
	}

	/**
	 * Ownership given to a new authority, all other ownership cleared
	 */
	function transferOwnership(address _addr) public isOwner() {
		owner = _addr;
		delete additionalOwners;
	}
}
