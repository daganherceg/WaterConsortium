const Token = artifacts.require('Token');
const Entity = artifacts.require('Entity');
const ApprovalContract = artifacts.require('ApprovalContract');
const Ownable = artifacts.require('Ownable');

module.exports = function(deployer) {
	deployer.deploy(Token);
};

module.exports = function(deployer) {
	deployer.deploy(Entity);
};

module.exports = function(deployer) {
	deployer.deploy(ApprovalContract);
};

module.exports = function(deployer) {
	deployer.deploy(Ownable);
};
