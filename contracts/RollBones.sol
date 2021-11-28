// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./DiceNFT.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//interface IERC20 {
//    function transfer(address _to, uint256 _amount) external returns (bool);

//    function balanceOf(address account) external view returns (uint256);
//}

contract RollBones is Ownable, VRFConsumerBase {
    // replace "0x0xcb31...92Cc with your deployed DiceNFT.sol contract address
    address internal diceNFTaddr = 0xcb316BF5AD352003A720e8bBB0ac46017fd292Cc;

    // Mumbai
    address internal vrfCoordinator =
        0x8C7382F9D8f56b33781fE506E897a4F1e2d17255;
    address public linkToken = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    bytes32 internal keyHash =
        0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
    uint256 internal fee = 0.0001 * 10**18;
    uint256 internal maticFee = 0.005 * 10**18;

    // Kovan
    // address internal vrfCoordinator =
    //     0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9;
    // address public linkToken = 0xa36085F69e2889c224210F603D836748e7dC0088;
    // bytes32 internal keyHash =
    //     0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
    // uint256 internal fee = 0.1 * 10**18;

    // Rinkeby
    // address internal vrfCoordinator =
    //     0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B;
    // address public linkToken = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;
    // bytes32 internal keyHash =
    //     0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
    // uint256 internal fee = 0.1 * 10**18;

    uint256 public randomResult;
    address payable public admin;

    mapping(bytes32 => address) public requestToSender;
    mapping(bytes32 => uint256[]) public requestToResult;

    event BonesRolled(address indexed _from, bytes32 indexed _id);
    event RollResult(
        address indexed _from,
        bytes32 indexed _id,
        uint256[] _result
    );

    // Constructor inherits VRFConsumerBase
    constructor() VRFConsumerBase(vrfCoordinator, linkToken) {
        admin = payable(msg.sender);
    }

    function getRandomNumber() public payable returns (bytes32) {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK - fill contract with faucet"
        );
        require(msg.value >= maticFee, "Not enough MATIC included");
        bytes32 requestId = requestRandomness(keyHash, fee);
        requestToSender[requestId] = msg.sender;
        emit BonesRolled(msg.sender, requestId);
        randomResult = 0;
        return requestId;
    }

    //  Callback function used by VRF Coordinator
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        uint256[] memory _res = new uint256[](5);
        randomResult = randomness;
        for (uint256 i = 0; i < 5; i++) {
            _res[i] = (uint256(keccak256(abi.encode(randomness, i))) % 6) + 1;
        }
        requestToResult[requestId] = _res;
        emit RollResult(requestToSender[requestId], requestId, _res);
    }

    function getAccountBalances() public view returns (uint256[] memory) {
        DiceNFT diceNFT = DiceNFT(diceNFTaddr);
        return diceNFT.getAccountBalances(msg.sender);
    }

    function withdrawAllMatic() external payable onlyOwner {
        admin.transfer(address(this).balance);
    }

    function withdrawAllLink() external payable onlyOwner {
        IERC20 tokenContract = IERC20(linkToken);
        uint256 balance = tokenContract.balanceOf(address(this));
        tokenContract.transfer(admin, balance);
    }
}
