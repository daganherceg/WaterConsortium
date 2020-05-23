const Entity = artifacts.require('Entity');
const ApprovalContract = artifacts.require('ApprovalContract');
const truffleAssert = require('truffle-assertions');

contract('Entity', function([owner, newOwner, ...accounts]) {
	let entity;
	let contract;

	/**
	 * Testing entity and entity ownershop
	 */

	describe('Entity init', () => {
        before(async () => {
            entity = await Entity.new(owner, "Entity");
            contract = await ApprovalContract.new(entity.address);
			await entity.setApprovalContract(contract.address);
        });

        it("entity init", async () => {
        	let addr = await entity.getOwner.call();
        	assert.equal(addr, owner);
        	let len = await entity.getAdditionalOwnersLength.call();
        	assert.equal(len.toString(), "0");
        });

    	it("eniity owner established", async () => {
            const addr = await entity.getOwner.call({ from: owner });
            assert.equal(owner, addr);
        });

        it("non entity owner fails to add another token owner", async () => {
            await truffleAssert.reverts(entity.addAdditionalOwner(accounts[0], {
                from: accounts[0]
            }));
        });

        it("eniity owner added another token owner", async () => {
            await entity.addAdditionalOwner(accounts[0], {
                from: owner
            });
        });

        it("confirm new owner added", async () => {
            const len = await entity.getAdditionalOwnersLength.call({ from: owner });
            assert.equal(len.toString(), "1");
            const auth = await entity.getAdditionalOwner.call(0);
            assert.equal(auth, accounts[0]);
        });
    });

    describe('Trade approved', () => {
    	it('trade should approve', async () => {
    		assert.equal(true, await entity.approveTrade.call(owner, accounts[0], 22));
    	});

    	it('trade not should approve', async () => {
    		assert.equal(false, await entity.approveTrade.call(owner, accounts[0], 23));
    	});
    });

    describe('Transfer entity ownership', () => {
        it('non owner cannot transfer ownership', async () => {
            await truffleAssert.reverts( entity.transferOwnership.call(newOwner, { from: newOwner }));
        });

        it('ownership transfered', async () => {
            await entity.transferOwnership(newOwner, { from: owner });
            assert.equal(await entity.getOwner(), newOwner);
        });

        it('additional ownerships rights revoked', async () => {
            const len = await entity.getAdditionalOwnersLength.call({ from: newOwner });
            assert.equal(len.toString(), "0");
        });

        it('contract address unchanged', async () => {
        	assert.equal(contract.address, await entity.getApprovalContract());
        });
    });

    describe('Trading under new ownership', () => {
    	it('trade denied - previous owner', async () => {
            // TODO: ownership
    		await truffleAssert.reverts( entity.approveTrade(accounts[1], accounts[2], 22, { from: owner }) );
    	});

    	it('trade approved - current owner', async () => {
    		assert.equal(true, await entity.approveTrade.call(accounts[1], accounts[2], 22, { from: newOwner }) );
    	});
    });
});
