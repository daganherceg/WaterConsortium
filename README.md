# Water Consortium
Experimental consortium framework which explores the possibility of self-organising governments and mutable contracts to automate intergovernmental communication.

*Disclaimer*: These work-in-progress contracts are experimental only and have not been audited in any way.

## Use case
This experiment centralises around the complex ownership and operation of the Murray-Darling Basin, where the shared resources are allocated from the Murray-Darling Basin Authority to states who then filter the allocation further. The trade and distribution of the shared resource is managed by each local water authority. These entities each contribute to over 15,000 business rules (civicledger.io) that may result in trades being approved or rejected. 

Each entity is currently required to send a copy of their trading rules to the MDBA and are required to abide by the rules set out by the MDBA and any other authority that they may interact with when resolving a trade. The current process can take anywhere from days to months in extreme cases to resolve a request.

Instead of resolving trades within a complex and centralised contract, proposed is an upgradeable structure where each local water authority retains control over their individual operating rules. These contracts are then used to build dynamic trade requests involving all relevant water authorities.

## Structure
![Alt text](src/img/approvalStucture.png?raw=true "Water Consortium approval structure")
![Alt text](src/img/consortiumERD.png?raw=true "Water Consortium relational diagram")

The token contract stores the concrete addresses of each water authority / entity, which stores a reference to their parent and child authorities. It may seem counterintuitive to introduce more parties into the decision making process, however this process will allow for a dynamic approval chain which is modular and as a result can be updated without input or disruption to the remainder of the network.

The tree structure is important for filtering water allocations down the tree at the outset of each season and for resolving trade requests up the tree starting at each party involved with a trade. Any invalid trade is stopped at the conflicting contract.

### Consensus Model
A vote-based PoA consensus model is used, where entities can write transactions to the chain. This consensus model relies on trusted entities.

In addition trades can only be written with a 100% yes vote from all other entities with a stake in the transaction.

![Alt text](src/img/approvalRequestStructure.png?raw=true "Approving trades")

### Self-Organising Structure
Entities / authorities are added to the stucture, linking to their parent node. A node is removed by "bypassing" it (assigning its children to its parent).

![Alt text](src/img/selfOrganisingStructure.png?raw=true "Approving trades")

### Proxy Pattern
The concrete address is used to interact with each entity, with requests being forwarded to the latest approval contract. Since the logic set out on each contract cannot be changed, they will need to be replaced if any changes to the rules are needed. The proxy contracts ensure that references to the correct approval contract only need to be updated at one location. A circuit breaker is also used on retired contracts to ensure that they cannot be called directly.

At this stage, interactions with the approval contracts can only be called by the proxy contract which maintains and resolves the ownership of the entity. Below is an example of how upgrading the contracts would occur both with and without a proxy.

![Alt text](src/img/proxyContracts.png?raw=true "Upgrading contracts with and without a proxy")

### Minting
Another benefit of the hierarchical structure is the ability for the overall commodity to be filtered down the tree with each authority given the opportunity to disperse their allocations to their children. Each authority can determine whether the total amount is to be distributed, and in what portions. This is important as it needs to be done at the beginning of each season. It also allows for each entity owner the ability to release allocations in stages.

![Alt text](src/img/waterAllocation.png?raw=true "Upgrading contracts with and without a proxy")



## Requirements
1. NPN & NodeJS, install via Homebrew or other
`$ brew install node`

2. Truffle
`$ npm install -g truffle`

3. Ganache
Download at: https://www.trufflesuite.com/ganache

3. Clone latest branch

## Running the code
You will need two Terminal instances. The first to run deploy a local Ethereum blockchain to deploy the experiment to. 
The second will be used to run the truffle tests

1. Run the client on port 8545
`$ ganache-cli -p 8545`

2. On the separate terminal window
`$ truffle test` to run the unit tests

## TODO:

This exploration is work in progress with the following goals to come:
- [x] Hierarchical Structure
- [x] Base framework for Entities, Approval Contracts, and Token
- [x] Ownable interface
- [ ] Removing nodes & reorganising the tree
- [ ] Enforce interfaces
- [ ] Testing protocol that must be passed in order to add or change approval contracts
- [ ] Update peer-to-peer trading rules to be more restrictive: at the moment, trades are assumed
- [ ] Upgrade peer-to-peer trading platform to allow users to set prices
- [ ] Front-end
- [ ] Explore non-ethereum based blockchains to remove the ETH based work fee
