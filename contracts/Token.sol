pragma solidity ^0.6.2;
pragma experimental ABIEncoderV2;

import "./Ownable.sol";
import "./Entity.sol";

/**
 * This Token represnets an
 */
contract Token is Ownable {
	uint8 private decimals = 18;
	uint private totalSupply; // allocations
	uint private totalEntitlements; // entitlements

	/**
	 * Each water entitlement holder is a trader
	 */

	struct EntityStruct {
		address entityContract;
		uint entitlement;
		uint allocation;
		uint storedWater;
		address parentAuthority;
		address[] children;
		bool added;
	}

	// Storing entities as array and mapping for easier access and traversal
	address private rootEntity;
	mapping(address => EntityStruct) private entities;
	address[] private entityAddresses;

	// ---------- TOKEN ENTITY FUNCTIONS ---------- //

	// ----------------- GETTERS ----------------- //

	function getEntitiesLength() public view returns(uint) {
		return entityAddresses.length;
	}

	function getEntity(address _entityContract) public view returns (EntityStruct memory) {
		return entities[_entityContract];
	}

	function getEntityAt(uint _index) public view returns(address) {
		return entityAddresses[_index];
	}

	function getChildrenLength(address _address) public view returns(uint) {
		return entities[_address].children.length;
	}

	function getChildAt(address _address, uint _index) public view returns(address) {
		return entities[_address].children[_index];
	}

	function getRootEntity() isOwner() public view returns(address) {
		return rootEntity;
	}

	// --------------- END GETTERS ----------------- //


	// ---------- TOKEN ENTITY FUNCTIONS ---------- //

	function addRootEntity(address _entityContract) isOwner() public {
		require(rootEntity == address(0), "Root Entity already assigned");
		require(!entities[_entityContract].added, "Entity already exists");
		rootEntity = _entityContract;
		entityAddresses.push(_entityContract);

		EntityStruct memory entityStruct;
		entityStruct.entityContract = _entityContract;
		entityStruct.added = true;

		entities[_entityContract] = entityStruct;
	}

	/**
	 * Entity created by calling the entity contract outside of this function
	 * and adding to the structure by calling addEntity
	 */
	function addEntity(address _entityContract, address _parent) public {
		require(rootEntity != address(0), "No root entity, create before adding");
		require(!entities[_entityContract].added, "Entity already exists");
		require(entities[_parent].added && Entity(_parent).isActive(), "Parent entity not active");

		// Ask parent to add

		// parentContract.askToAdd(rootEntity);
		require(Entity(_parent).askToAdd(_entityContract), "Parent authority denied request");

		entityAddresses.push(_entityContract);
		entities[_parent].children.push(_entityContract);

		EntityStruct memory entityStruct;
		entityStruct.entityContract = _entityContract;
		entityStruct.parentAuthority = _parent;
		entityStruct.added = true;
		entities[_entityContract] = entityStruct;
	}

	// -------- END TOKEN ENTITY FUNCTIONS -------- //


	// -------- TOKEN MANAGMENT FUNCTIONS -------- //

	/**
	 * Get total allocations within the network
	 */
	function getTotalSupply() public view returns(uint) {
		return totalSupply;
	}

	function getTotalEntitlements() public view returns(uint) {
		return totalEntitlements;
	}

	// ------ END TOKEN MANAGMENT FUNCTIONS ------ //

	// ---------- TOKEN TRADE FUNCTIONS ---------- //

	function addTrader(
			address _addr,
			address _authority,
			uint _storedWater) isOwner() public {
		require(rootEntity != address(0),
				"No root entity, create before adding");
		require(entities[_authority].added &&
				Entity(_authority).isActive(),
				"Parent entity not active");
		require(!traders[_addr].active, "Trader already exists");

		traderAddresses.push(_addr);

		Trader memory trader;
		trader.trader = _addr;
		trader.authority = _authority;
		trader.storedWater = _storedWater;
		trader.active = true;
		traders[_addr] = trader;
	}

	function getTraderLength() public view returns(uint) {
		return traderAddresses.length;
	}

	function getTrader(address _addr) activeTrader(_addr) public view returns(Trader memory) {
		return traders[_addr];
	}

	function validTrade(address _from,
			address _to,
			uint _amount) private returns(bool) {
		address fromAuthority = traders[_from].authority;
		address toAuthority = traders[_to].authority;

		// LOCAL
		if (fromAuthority == toAuthority) {
			require(Entity(fromAuthority)
					.approveTrade(_from, _to, _amount),
					"Local entity denied trade");
		} else {
		// FOREIGN
			uint i = 0;
			while (entities[fromAuthority]
					.parentAuthority != rootEntity)
			{
				require(Entity(fromAuthority)
						.approveTrade(_from, _to, _amount),
						"Foreign entity denied trade");
				fromAuthority = entities[fromAuthority].parentAuthority;
			}
		}
		require(Entity(rootEntity).
						approveTrade(_from, _to, _amount),
						"Trade denied on 'from' branch");
		return true;
	}

	// Storing traders as array and mapping for easier access and traversal
	mapping(address => Trader) private traders;
	address[] private traderAddresses;

	/**
	 * Each water entitlement holder is a trader
	 */
	struct Trader {
		address trader;
		uint entitlement;
		uint allocation;
		uint storedWater;
		bool active;
		address authority;
	}

	modifier activeTrader(address _addr) {
		require(traders[_addr].active, "Not an active trader address");
		_;
	}

	function getTraderAuthority(address _addr) public view returns(address) {
		return traders[_addr].authority;
	}

	function getEntitiesParentAuthority(
			address _addr)
	public view returns(address) {
		return entities[_addr].parentAuthority;
	}

	// TODO: enum for the trade type: deliver, allocaiton, entitlement
	function trade(
			address _from,
			address _to,
			uint _amount) public {
		validTrade(_from, _to, _amount);
		// TODO: transfer water
	}

	// -------- END TOKEN TRADE FUNCTIONS -------- //
}
