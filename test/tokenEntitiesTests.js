const Token = artifacts.require('Token');
const Entity = artifacts.require('Entity');
const truffleAssert = require('truffle-assertions');

contract('Token-Entities', function([tokenOwner, MDBA, NSW, VIC, ACT, accounts]) {
    let token;
    let root;
    describe('Entity Managment', () => {
        before(async () => {
            root = await Entity.new(tokenOwner, 'MDBA');
            token = await Token.new();
        });

        it("empty entity mapping", async () => {
            assert.equal('0', await token.getEntitiesLength());
        });

        it("only token owner can add root entity", async () => {
            await truffleAssert.reverts(token.addRootEntity(root.address, { from: NSW }));
        });

        it("adding a root entity", async () => {
            await token.addRootEntity(root.address);
            assert.equal("MDBA", await root.getName());
            assert.equal(tokenOwner, await root.getOwner());
            assert.equal('1', await token.getEntitiesLength());
        });

        it("one root node allowed", async () => {
            await truffleAssert.reverts(token.addRootEntity(root.address));
        });

        it("testing struct", async () => {
            let struct = await token.getEntity.call(root.address);
            assert.equal(root.address, struct.entityContract);
            assert.equal("0", struct.entitlement);
            assert.equal("0", struct.allocation);
            assert.equal("0", struct.storedWater);
            assert.equal("0x0000000000000000000000000000000000000000", struct.parentAuthority);
            assert.equal("0", struct.children.length);
            assert.equal(true, struct.added);
        });

        it("cannot double add", async () => {
            await truffleAssert.reverts(token.addRootEntity(root.address));
            assert.equal('1', await token.getEntitiesLength());
        });
    });

    describe('Entity Tree Structure', () => {
        before(async () => {
            nsw = await Entity.new(tokenOwner, 'NSW', { from: NSW });
            vic = await Entity.new(tokenOwner, 'VIC', { from: VIC });
            act = await Entity.new(tokenOwner, 'ACT', { from: ACT });
        });

        it("adding child entity", async () => {
            await token.addEntity(nsw.address, root.address);
            assert.equal('2', await token.getEntitiesLength());

            let struct = await token.getEntity.call(nsw.address);
            assert.equal(nsw.address, struct.entityContract);
            assert.equal("0", struct.entitlement);
            assert.equal("0", struct.allocation);
            assert.equal("0", struct.storedWater);
            assert.equal(root.address, struct.parentAuthority);
            assert.equal("0", struct.children.length);
            assert.equal(true, struct.added);
        });

        it("adding second child entity", async () => {
            await token.addEntity(vic.address, root.address);
            assert.equal('3', await token.getEntitiesLength());

            let struct = await token.getEntity.call(vic.address);
            assert.equal(vic.address, struct.entityContract);
            assert.equal("0", struct.entitlement);
            assert.equal("0", struct.allocation);
            assert.equal("0", struct.storedWater);
            assert.equal(root.address, struct.parentAuthority);
            assert.equal("0", struct.children.length);
            assert.equal(true, struct.added);
        });

        it("verify tree structure", async () => {
            assert.equal(root.address, await token.getRootEntity());
            assert.equal('3', await token.getEntitiesLength());
            assert.equal("2", await token.getChildrenLength(root.address));
            assert.equal("0", await token.getChildrenLength(nsw.address));
            assert.equal("0", await token.getChildrenLength(vic.address));
            assert.equal(nsw.address, await token.getChildAt(root.address, 0));
            assert.equal(vic.address, await token.getChildAt(root.address, 1));
        });

        it("verify array", async () => {
            assert.equal(root.address, await token.getEntityAt(0));
            assert.equal(nsw.address, await token.getEntityAt(1));
            assert.equal(vic.address, await token.getEntityAt(2));
        });

        it("adding an extra layer", async () => {
            await token.addEntity(act.address, nsw.address);
            assert.equal('4', await token.getEntitiesLength());
        });

        it("verify tree structure", async () => {
            assert.equal("2", await token.getChildrenLength(root.address));
            assert.equal("0", await token.getChildrenLength(vic.address));
            assert.equal("1", await token.getChildrenLength(nsw.address));
            assert.equal(act.address, await token.getChildAt(nsw.address, 0));
        });

        it("verify array", async () => {
            assert.equal(root.address, await token.getEntityAt(0));
            assert.equal(nsw.address, await token.getEntityAt(1));
            assert.equal(vic.address, await token.getEntityAt(2));
            assert.equal(act.address, await token.getEntityAt(3));
        });
    });
});
