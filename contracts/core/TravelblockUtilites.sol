pragma solidity ^0.4.19;

import "./TravelblockCityFactory.sol";

contract TravelblockUtilites is TravelblockCityFactory {

  modifier onlyOwnerOf(uint _cityId) {
    require(msg.sender == cityToOwner[_cityId]);
    _;
  }
}
