# Water Consortium
Experimental consortium framework which explores the possibility of self-organising governments and mutable contracts to automate intergovernmental communication.

## Use case
This experiment centralises around the complex ownership and operation of the Murray-Darling Basin, where the shared resources are allocated from the Murray-Darling Basin Authority to states who then filter the allocation further. The trade and distribution of the shared resource is managed by each local water authority. These entities each contribute to over 15,000 business rules that may result in trades being approved or rejected. Each entity is required to send a copy of their trading rules to the MDBA and are required to abide by the rules set out by the MDBA and any other authority that they may interact with when resolving a trade. The current process can take anywhere from days up until 9 weeks to resolve a request.

Instead of resolving trades within a complex and centralised contract, proposed is an upgradeable structure where each local water authority retains control over their individual operating rules. These contracts are then used to build dynamic trade requests involving all water authorities involved in trades in seconds.

## Structure

The token contract stores the concrete addresses of each water authority / entity, which stores a reference to their parent and child authorities.

The tree structure is important for filtering water allocations down the tree at the outset of each season and for resolving trade requests up the tree for each party.

### Consensus Model
A vote-based PoA consensus model is used, where entities can write transactions to the chain. This consensus model relies on trusted entities.

In addition trades can only be written with a 100% yes vote from all other entities with a stake in the transaction. 

### Proxy Pattern
The concrete address is used to interact with each entity, with requests being forwarded to the latest approval contract. Since the logic set out on each contract cannot be changed, they will need to be replaced if any changes to the rules are needed. The proxy contracts ensure that references to the correct approval contract only need to be updated at one location. A circuit breaker is also used on retired contracts to ensure that they cannot be called directly.

At this stage, interactions with the approval contracts can only be called by the proxy contract which maintains and resolves the ownership of the entity.


Disclaimer: These work in progress contracts are experimental only and have not been audited in any way.


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
