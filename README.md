# WaterConsortium
Experimental consortium blockchain which explores the possiblity of self-organising governments and mutable contracts to automate intergovernmental communication.

## Requirments
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
