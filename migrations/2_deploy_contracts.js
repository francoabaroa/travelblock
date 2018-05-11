let TravelochainCityFactory = artifacts.require("../contracts/core/TravelochainCityFactory.sol");

module.exports = function(deployer) {
  console.log('deployer', deployer);
  deployer.deploy(TravelochainCityFactory, {gas: 4700000});
};
