pragma solidity ^0.4.19;

import "./TravelochainCityFactory.sol";

contract TravelochainUtilites is TravelochainCityFactory {

  modifier onlyOwnerOf(uint _cityId) {
    require(msg.sender == cityToOwner[_cityId]);
    _;
  }
}
