const Token = artifacts.require('Token');
const Entity = artifacts.require('Entity');
const truffleAssert = require('truffle-assertions');

contract('Token', function([owner, newOwner, ...accounts]) {
    let contract;
    let entity;
    describe('Testing Token setup', () => {
        before(async () => {
            contract = await Token.new();
            entity = await Entity.new("Entity");
            await contract.addRootEntity(entity.address);
        });
        it("empty token", async () => {
            const allocaiton = await contract.getTotalSupply.call();
            assert.equal(allocaiton.toString(), "0");
            const entitlements = await contract.getTotalEntitlements.call();
            assert.equal(entitlements.toString(), "0");
        });

        it("token owner established", async () => {
            const addr = await contract.getOwner.call({ from: owner });
            assert.equal(owner, addr);
        });

        it("non token owner fails to add another token owner", async () => {
            await truffleAssert.reverts(contract.addAdditionalOwner(accounts[0], {
                from: accounts[0]
            }));
        });

        it("token owner added another token owner", async () => {
            await contract.addAdditionalOwner(accounts[0], {
                from: owner
            });
        });

        it("confirm new owner added", async () => {
            const len = await contract.getAdditionalOwnersLength.call({ from: owner });
            assert.equal(len.toString(), "1");
            const auth = await contract.getAdditionalOwner.call(0);
            assert.equal(auth, accounts[0]);
        });
    });

    describe('Transfer ownership', () => {
        it('non owner cannot transfer ownership', async () => {
            await truffleAssert.reverts( contract.transferOwnership.call(newOwner, { from: newOwner }));
        });

        it('ownership transfered', async () => {
            await contract.transferOwnership(newOwner, { from: owner });
            assert.equal(await contract.getOwner(), newOwner);
        });

        it('additional ownerships rights revoked', async () => {
            const len = await contract.getAdditionalOwnersLength.call({ from: newOwner });
            assert.equal(len.toString(), "0");
        });
    });

    describe('Testing Trader function', () => {
        before(async () => {
            contract = await Token.new();
            entity = await Entity.new("Entity");
            await contract.addRootEntity(entity.address);
        });

        it("fresh Token", async () => {
            const authLen = await contract.getAdditionalOwnersLength.call();
            assert.equal(authLen.toString(), "0");
            const traderLen = await contract.getTraderLength.call();
            assert.equal(traderLen.toString(), "0");
        });

        it("non owner failed to add traded", async () => {
            await truffleAssert.reverts(contract.addTrader(
                    accounts[0],
                    entity.address,
            4, {
                from: accounts[3]
            }));
        });

        it("trader added", async () => {
            await contract.addTrader(
                    accounts[0],
                    entity.address,
            4);
            const traderLen = await contract.getTraderLength.call();
            assert.equal(traderLen.toString(), "1");
        });

        it("cannot double add trader", async () => {
            await truffleAssert.reverts( contract.addTrader(
                    accounts[0],
                    entity.address,
            4));
        });

        it("confirmed accurate trader added", async () => {
            const trader = await contract.getTrader.call(accounts[0]);
            assert.equal(trader.trader, accounts[0]);
            assert.equal(trader.entitlement, 0);
            assert.equal(trader.allocation, 0);
            assert.equal(trader.storedWater, 4);
            assert.equal(trader.active, true);
            assert.equal(trader.authority.toString(),
                    entity.address);
        });

        it("confirm multiple traders", async () => {
            for (let i = 1; i < accounts.length; i++) {
                await contract.addTrader(
                    accounts[i],
                    entity.address,
                    i);
            }
            const traderLen = await contract.getTraderLength.call();
            assert.equal(traderLen.toString(), "8");
        });
    });
});
