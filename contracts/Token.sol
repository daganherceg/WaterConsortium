pragma solidity ^0.6.2;
pragma experimental ABIEncoderV2;

import "./Ownable.sol";
import "./Entity.sol";


/**
 * This Token represnets an
 */
contract Token is Ownable {
    uint8 private decimals = 18;
    uint256 private totalSupply; // allocations
    uint256 private totalEntitlements; // entitlements

    struct EntityProxyStruct {
        address entityContract;
        uint256 entitlement;
        uint256 allocation;
        uint256 storedWater;
        address parentAuthority;
        address[] children;
        bool added;
    }

    struct Trader {
        address trader;
        uint256 entitlement;
        uint256 allocation;
        uint256 storedWater;
        bool active;
        address authority;
    }

    // Storing entities as array and mapping for easier access and traversal
    address private rootEntity;
    mapping(address => EntityProxyStruct) private entities;
    address[] private entityAddresses;

    // Storing traders as array and mapping for easier access and traversal
    mapping(address => Trader) private traders;
    address[] private traderAddresses;

    modifier activeTrader(address _addr) {
        require(
            traders[_addr].active,
            "Not an active trader address"
        );
        _;
    }

    // ----------------- GETTERS ----------------- //
    function getTotalSupply() public view returns (uint256) {
        return totalSupply;
    }

    function getTotalEntitlements() public view returns (uint256) {
        return totalEntitlements;
    }

    function getEntitiesLength() public view returns (uint256) {
        return entityAddresses.length;
    }

    function getEntity(address _entityContract) isOwner()
        public
        view
        returns (EntityProxyStruct memory)
    {
        return entities[_entityContract];
    }

    function getEntityAt(uint256 _index) isOwner()
        public
        view
        returns (address)
    {
        return entityAddresses[_index];
    }

    function getEntitiesParentAuthority(address _addr) isOwner()
        public
        view
        returns (address)
    {
        return entities[_addr].parentAuthority;
    }

    // Trader's parent enitity
    function getTraderAuthority(address _addr) isOwner()
        public
        view
        returns (address)
    {
        return traders[_addr].authority;
    }

    function getTraderLength() public view returns (uint256) {
        return traderAddresses.length;
    }

    function getTrader(address _addr) isOwner()
        public
        view
        activeTrader(_addr)
        returns (Trader memory)
    {
        return traders[_addr];
    }

    function getChildrenLength(address _address) isOwner()
        public
        view
        returns (uint256)
    {
        return entities[_address].children.length;
    }

    function getChildAt(address _address, uint256 _index) isOwner()
        public
        view
        returns (address)
    {
        return entities[_address].children[_index];
    }

    function getRootEntity() public view isOwner() returns (address) {
        return rootEntity;
    }

    // --------------- END GETTERS ----------------- //

    // ---------- TOKEN ENTITY FUNCTIONS ---------- //

    function addRootEntity(address _entityContract) public isOwner() {
        require(
            rootEntity == address(0),
            "Root Entity already assigned"
        );
        require(
            !entities[_entityContract].added,
            "Entity already exists"
        );
        rootEntity = _entityContract;
        entityAddresses.push(_entityContract);

        EntityProxyStruct memory entityStruct;
        entityStruct.entityContract = _entityContract;
        entityStruct.added = true;

        entities[_entityContract] = entityStruct;
    }

    /**
     * Entity created by calling the entity contract outside of this function
     * and adding to the structure by calling addEntity
     */
    function addEntity(address _entityContract, address _parent) isOwner()
        public
    {
        require(
            rootEntity != address(0),
            "No root entity, create before adding"
        );
        require(
            !entities[_entityContract].added,
            "Entity already exists"
        );
        require(
            entities[_parent].added && Entity(_parent).isActive(),
            "Parent entity not active"
        );
        require(
            Entity(_parent).askToAdd(_entityContract),
            "Parent authority denied request"
        );

        entityAddresses.push(_entityContract);
        entities[_parent].children.push(_entityContract);

        EntityProxyStruct memory entityStruct;
        entityStruct.entityContract = _entityContract;
        entityStruct.parentAuthority = _parent;
        entityStruct.added = true;
        entities[_entityContract] = entityStruct;
    }

    // ---------- TOKEN TRADER FUNCTIONS ---------- //

    function validTrade(
        address _from,
        address _to,
        uint256 _amount
    ) isOwner() private returns (bool) {
        address fromAuthority = traders[_from].authority;
        address toAuthority = traders[_to].authority;

        // LOCAL
        if (fromAuthority == toAuthority) {
            require(
                Entity(fromAuthority).approveTrade(
                    _from,
                    _to,
                    _amount
                ),
                "Local entity denied trade"
            );
        } else {
            // FOREIGN
            while (
                entities[fromAuthority].parentAuthority != rootEntity
            ) {
                require(
                    Entity(fromAuthority).approveTrade(
                        _from,
                        _to,
                        _amount
                    ),
                    "Foreign entity denied trade"
                );
                fromAuthority = entities[fromAuthority]
                    .parentAuthority;
            }
        }
        require(
            Entity(rootEntity).approveTrade(_from, _to, _amount),
            "Trade denied on 'from' branch"
        );
        return true;
    }

    function addTrader(
        address _addr,
        address _authority,
        uint256 _storedWater
    ) public isOwner() {
        require(
            rootEntity != address(0),
            "No root entity, create before adding"
        );
        require(
            entities[_authority].added &&
                Entity(_authority).isActive(),
            "Parent entity not active"
        );
        require(!traders[_addr].active, "Trader already exists");

        traderAddresses.push(_addr);

        Trader memory trader;
        trader.trader = _addr;
        trader.authority = _authority;
        trader.storedWater = _storedWater;
        trader.active = true;
        traders[_addr] = trader;
    }

    // TODO: enum for the trade type: deliver, allocaiton, entitlement
    function trade(
        address _from,
        address _to,
        uint256 _amount
    ) isOwner() public {
        require(validTrade(_from, _to, _amount), "Invalid trade");
        // TODO: transfer water
    }

    // -------- END TOKEN TRADE FUNCTIONS -------- //
}
