const Entity = artifacts.require('Entity');
const ApprovalContract = artifacts.require('ApprovalContract');
const ReplacementApprovalContract = artifacts.require('ReplacementApprovalContract');
const truffleAssert = require('truffle-assertions');

contract('ApprovalContract', function([owner, newOwner]) {
	let entity;
	let contract;
	let updatedContract;
	let updatedContract2;
	describe('Contract Init', () => {
		before(async () => {
			entity = await Entity.new("Entity");
			contract = await ApprovalContract.new(entity.address);
			await entity.setApprovalContract(contract.address);
        });

        it('create and assign a contract', async () => {
        	assert.equal(true, await contract.isActive());
        	assert.equal(entity.address, await contract.getOwner());
        	assert.equal(contract.address, await entity.getApprovalContract());
        });
	});

	describe('Replacing contract', () => {
		before(async () => {
			updatedContract = await ApprovalContract.new(entity.address);
		});

		it('non entity owner should fail to change contracts', async () => {
			await truffleAssert.reverts(entity.setApprovalContract(updatedContract.address, { from: newOwner }));
		});

		it('contract changed', async () => {
			assert.notEqual(contract.address, updatedContract.address);
			await entity.changeApprovalContract(updatedContract.address, { from: owner });
			assert.equal(updatedContract.address, await entity.getApprovalContract());
		});

		it('new contract owned by entity', async () => {
			assert.equal(entity.address, await contract.getOwner());
		})

		it('original contract killed', async () => {
			assert.equal(false, await contract.isActive());
		});

		it('testing updated contract', async () => {
    		assert.equal(true, await entity.approveTrade.call(owner, newOwner, 22));
		});
	});
});
