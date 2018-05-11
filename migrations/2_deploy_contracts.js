let TravelblockCityFactory = artifacts.require("../contracts/core/TravelblockCityFactory.sol");

module.exports = function(deployer) {
  console.log('deployer', deployer);
  deployer.deploy(TravelblockCityFactory, {gas: 4700000});
};
