pragma solidity ^0.4.19;

import "./TravelblockHelper.sol";
import "../base/token/ERC721.sol";
import "../base/math/SafeMath.sol";

/// @title A contract that manages city ownership
/// @author francoabaroa
/// @notice For now, this contract can check balance of an owner, the owner of a city, and transfer ownership
/// @dev Compliant with OpenZeppelin's implementation of the ERC721 spec draft

contract TravelblockCityOwnership is TravelblockHelper, ERC721 {

  using SafeMath for uint256;

  mapping (uint => address) cityApprovals;

  /// @notice View how many cities an address has
  /// @param _owner is the address we are checking.
  function balanceOf(address _owner) public view returns (uint256 _balance) {
    return ownerCityCount[_owner];
  }

  function ownerOf(uint256 _tokenId) public view returns (address _owner) {
    return cityToOwner[_tokenId];
  }

  function _transfer(address _from, address _to, uint256 _tokenId) private {
    ownerCityCount[_to] = ownerCityCount[_to].add(1);
    ownerCityCount[msg.sender] = ownerCityCount[msg.sender].sub(1);
    cityToOwner[_tokenId] = _to;
    emit Transfer(_from, _to, _tokenId);
  }

  function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
    _transfer(msg.sender, _to, _tokenId);
  }

  function approve(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
    cityApprovals[_tokenId] = _to;
    emit Approval(msg.sender, _to, _tokenId);
  }

  function takeOwnership(uint256 _tokenId) public {
    require(cityApprovals[_tokenId] == msg.sender);
    address owner = ownerOf(_tokenId);
    _transfer(owner, msg.sender, _tokenId);
  }
}
