const Entity = artifacts.require('Entity');
const Token = artifacts.require('Token');
const EntityFactory = artifacts.require('EntityFactory');
const truffleAssert = require('truffle-assertions');

contract('Token-Entities', function([tokenOwner, MDBA, NSW, VIC, ACT]) {
    let root;
    let factory;

    describe('Entity Managment', () => {
        before(async () => {
            factory = await EntityFactory.new();
            root = await factory.newEntity.call('MDBA');

            // root = await Entity.new(rootAddress);
            token = await Token.new();

        });

        it("entity propertly created", async () => {
            console.log(root);
            // let root = await Entity.at(rootAddress);
            // await token.addRootEntity(rootAddress);
            // root = await token.getEntity(rootAddress);
            // console.log(rootAddress);
            // console.log(await root.entityContract);
            // assert.equal(root, await rootAddress);
        });

        it("adding a root entity", async () => {

            // assert.equal("MDBA", await root.getName());
        //     // assert.equal(tokenOwner, await root.getOwner());
        //     // assert.equal('1', await token.getEntitiesLength());
        });
    });
});
