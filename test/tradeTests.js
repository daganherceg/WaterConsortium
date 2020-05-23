const Token = artifacts.require('Token');
const Entity = artifacts.require('Entity');
const truffleAssert = require('truffle-assertions');

contract('Trading', function([tokenOwner, MDBA, NSW, VIC, ACT, trader1, trader2]) {
	let token;
    let root;
    let nsw;
    let vic;
    let act;
    describe('Approval Setup', () => {
        before(async () => {
        	token = await Token.new();
            root = await Entity.new(tokenOwner, 'MDBA');
            nsw = await Entity.new(tokenOwner, 'NSW', { from: NSW });
            vic = await Entity.new(tokenOwner, 'VIC', { from: VIC });
            act = await Entity.new(tokenOwner, 'ACT', { from: ACT });

            await token.addRootEntity(root.address);
            await token.addEntity(nsw.address, root.address);
            await token.addEntity(vic.address, root.address);
            await token.addEntity(act.address, nsw.address);
            await token.addTrader(trader1, root.address, 4);
            await token.addTrader(trader2, root.address, 5);
        });

        it("...", async () => {
        	await token.trade(trader1, trader2, 2);
        });
    });
});
