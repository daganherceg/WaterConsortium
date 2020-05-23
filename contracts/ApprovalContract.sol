pragma solidity ^0.6.2;

contract ApprovalContract {
	address private owner;
	bool private active;

	constructor(address _addr) public {
		owner = _addr;
		active = true;
	}

	modifier isOwner() {
		require(msg.sender == owner, "You are not authorsed to action this contract");
		_;
	}

	modifier activeContract() {
		require(isActive(), "Contract has been retired!");
		_;
	}

	function isActive() public view returns(bool) {
		return active;
	}

	function approveTrade(uint _amount) activeContract() public virtual returns(bool) {
		if (_amount % 2 != 0) {
			return false;
		}
		return true;
	}

	function getOwner() public view returns(address) {
		return owner;
	}

	function kill() activeContract() public {
		active = false;
	}
}
