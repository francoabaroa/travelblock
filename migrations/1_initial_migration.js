var Migrations = artifacts.require("./contracts/base/Migrations.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
