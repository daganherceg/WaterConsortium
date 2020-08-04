const Token = artifacts.require('Token');
const Entity = artifacts.require('Entity');
const EntityFactory = artifacts.require('EntityFactory');
const Ownable = artifacts.require('Ownable');

module.exports = async function(deployer) {
	deployer.deploy(Ownable);
	deployer.deploy(Token);
	// deployer.deploy(EntityFactory);
	const entity1 = await deployer.deploy(Entity, "NSW");
	const entity2 = deployer.deploy(Entity, "VIC");
};
