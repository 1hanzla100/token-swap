// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenSwap is Ownable {
    IERC20 immutable token;
    uint256 rate;

    constructor(address _token, uint256 _rate) {
        token = IERC20(_token);
        rate = _rate;
        // ! After Deployment, Tranfer Tokens to Contract Address
        // ! Before Sell Tokens, Approve Contract Address to Spend Tokens of Specific Address
    }

    function changeRate(uint256 _newRate) public onlyOwner {
        rate = _newRate;
    }

    function getRate() public view returns (uint256) {
        return rate;
    }

    function getToken() public view returns (address) {
        return address(token);
    }

    function buyTokens() public payable {
        uint256 amount = msg.value * rate;
        require(
            token.balanceOf(address(this)) >= amount,
            "Not enough tokens in the reserve"
        );
        token.transfer(msg.sender, amount);
    }

    function sellTokens(uint256 _amount) public {
        require(
            token.balanceOf(address(msg.sender)) >= _amount,
            "Not enough tokens to sell"
        );
        uint256 etherAmount = _amount / rate;
        require(address(this).balance >= etherAmount, "Not Enough Ether");
        token.transferFrom(msg.sender, address(this), _amount);
        (bool success, ) = payable(msg.sender).call{value: etherAmount}("");
        require(success, "Transfer failed.");
    }
}
