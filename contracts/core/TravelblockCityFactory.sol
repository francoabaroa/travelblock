pragma solidity ^0.4.19;

import "../base/ownership/Ownable.sol";
import "../base/math/SafeMath.sol";

contract TravelblockCityFactory is Ownable {

  using SafeMath for uint256;
  using SafeMath32 for uint32;
  using SafeMath16 for uint16;

  event NewCity(
    uint cityId,
    string cityName,
    string lat,
    string lng,
    string country,
    string notes,
    uint startDate,
    uint endDate
  );

  struct City {
    string cityName;
    string lat;
    string lng;
    string country;
    string notes;
    uint startDate;
    uint endDate;
  }

  City[] public cities;

  mapping (uint => address) public cityToOwner;
  mapping (address => uint) ownerCityCount;

  function _createCity(
    string _cityName,
    string _lat,
    string _lng,
    string _country,
    string _notes,
    uint _startDate,
    uint _endDate
  ) internal {
    uint id = cities.push(
      City(
        _cityName,
        _lat,
        _lng,
        _country,
        _notes,
        _startDate,
        _endDate
      )
    ) - 1;
    cityToOwner[id] = msg.sender;
    ownerCityCount[msg.sender] = ownerCityCount[msg.sender].add(1);
    emit NewCity(id, _cityName, _lat, _lng, _country, _notes, _startDate, _endDate);
  }

  function _generateRandomUint(string _str) private pure returns (uint) {
    /* this not safe :P */
    uint rand = uint(keccak256(_str));
    return rand;
  }

  function saveCityVisited(
    string _cityName,
    string _lat,
    string _lng,
    string _country,
    string _notes,
    uint _startDate,
    uint _endDate
  ) public {
    _createCity(_cityName, _lat, _lng, _country, _notes, _startDate, _endDate);
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
