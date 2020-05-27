pragma solidity ^0.6.2;
pragma experimental ABIEncoderV2;

import './Ownable.sol';
import './ApprovalContract.sol';


/**
 * Authorities operational contract
 */
contract Entity is Ownable {
    address private owner;
    string private name;
    address private approvalContract;
    bool private assignedContract;
    bool private active;

    constructor(string memory _name) public {
        name = _name;
        owner = msg.sender;
        active = true;
    }

    // ----------------- GETTERS ----------------- //

    function getApprovalContract() public view returns (address) {
        return approvalContract;
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function activeContract() public view returns (bool) {
        return assignedContract;
    }

    function isActive() public view returns (bool) {
        return active;
    }

    // --------------- END GETTERS --------------- //

    // ------- ENTITY MANAGEMENT FUNCTIONS ------ //

    /**
     * Entitys logic of approving the addition of child entities
     */
    function askToAdd(address _entitiy) public returns (bool) {
        return true;
    }

    // ----- END ENTITY MANAGEMENT FUNCTIONS ---- //

    // -------- ENTITY CONTRACT FUNCTIONS ------- //

    function setApprovalContract(address _addr) public isOwner() {
        require(
            !assignedContract,
            'Contract active, use changeApprovalContract()'
        );
        approvalContract = _addr;
        assignedContract = true;
    }

    function changeApprovalContract(address _addr) public isOwner() {
        ApprovalContract(approvalContract).kill();
        approvalContract = _addr;
        assignedContract = true;
    }

    // ------ END TOKEN CONTRACT FUNCTIONS ------ //

    // Anyone can ask if a trade is valid
    function approveTrade(
        address _from,
        address _to,
        uint256 _amount
    ) public returns (bool) {
        require(activeContract(), 'No active approval contract');
        return
            ApprovalContract(approvalContract).approveTrade(_amount);
    }
}
