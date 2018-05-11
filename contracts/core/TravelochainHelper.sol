pragma solidity ^0.4.19;

import "./TravelochainUtilites.sol";

contract TravelochainHelper is TravelochainUtilites {

  uint upgradeFee = 0.001 ether;

  function withdraw() external onlyOwner {
    owner.transfer(this.balance);
  }

  function setLevelUpFee(uint _fee) external onlyOwner {
    upgradeFee = _fee;
  }

  function upgrade(uint _cityId) external payable {
    require(msg.value == upgradeFee);
    // change cities[_cityId].upgrade = true;
  }

  function getCitiesByOwner(address _owner) external view returns(uint[]) {
    uint[] memory result = new uint[](ownerCityCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < cities.length; i++) {
      if (cityToOwner[i] == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

}
