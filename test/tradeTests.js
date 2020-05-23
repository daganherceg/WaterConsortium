const Token = artifacts.require('Token');
const Entity = artifacts.require('Entity');
const ApprovalContract = artifacts.require('ApprovalContract');
const truffleAssert = require('truffle-assertions');

// TODO: edge case tests (ie from incorrect addresses)
// TODO: ownership of adding trader isnt working.

contract('Trading', function([tokenOwner, MDBA, NSW, VIC, ACT, trader1, trader2, trader3, trader4]) {
	let token;
    let root;
    let nsw;
    let vic;
    let act;
    let contract;
    describe('Approval Setup', () => {
        before(async () => {
        	token = await Token.new();
            root = await Entity.new(tokenOwner, 'MDBA');
            nsw = await Entity.new(tokenOwner, 'NSW');
            vic = await Entity.new(tokenOwner, 'VIC');
            act = await Entity.new(tokenOwner, 'ACT');

            await token.addRootEntity(root.address);
            await token.addEntity(nsw.address, root.address);
            await token.addEntity(vic.address, root.address);
            await token.addEntity(act.address, vic.address);
            await token.addTrader(trader1, nsw.address, 4);
            await token.addTrader(trader2, nsw.address, 5);
            await token.addTrader(trader3, vic.address, 5);
            await token.addTrader(trader4, act.address, 5);
            contract = await ApprovalContract.new(root.address);
			await root.setApprovalContract(contract.address);
			contract = await ApprovalContract.new(nsw.address);
			await nsw.setApprovalContract(contract.address);
			contract = await ApprovalContract.new(vic.address);
			await vic.setApprovalContract(contract.address);
			contract = await ApprovalContract.new(act.address);
			await act.setApprovalContract(contract.address);

        });

        it("local traders", async () => {
        	assert.equal(await token.getTraderAuthority(trader1),
        			await token.getTraderAuthority(trader2));
        	console.log(await token.getOwner());
        	console.log(tokenOwner);
        	console.log(MDBA);
        	console.log(NSW);
        	console.log(VIC);
        	console.log(ACT);
        	await token.trade(trader1, trader2, 0);
        });

        it("foreign traders", async () => {
        	assert.notEqual(await token.getTraderAuthority(trader1),
        			await token.getTraderAuthority(trader3));
        	assert.equal(nsw.address,
        			await token.getTraderAuthority(trader1));
        	assert.equal(await root.address,
        			await token.getEntitiesParentAuthority(nsw.address));
			assert.equal(await root.address,
        			await token.getEntitiesParentAuthority(vic.address));
        	await token.trade(trader2, trader3, 0);
        });

        it("foreign traders, multi level", async () => {
        	await token.trade(trader2, trader4, 0);
        });
    });
});
