// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20 {
    function transfer(address _to, uint256 _amount) external returns (bool);

    function balanceOf(address account) external view returns (uint256);
}

contract DiceNFT is ERC1155, Ownable, VRFConsumerBase {
    // Mumbai
    address internal vrfCoordinator =
        0x8C7382F9D8f56b33781fE506E897a4F1e2d17255;
    address public linkToken = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    bytes32 internal keyHash =
        0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
    uint256 internal fee = 0.0001 * 10**18;
    uint256 internal maticFee = 0.25 * 10**18;

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

    // uint256 requestId;
    uint256 public randomResult;
    string public randomColor;
    address payable public admin;

    uint256[] public tokenIds = [0, 1, 2, 3, 4, 5, 6];

    mapping(bytes32 => address) requestToSender;

    event MintingInitiated(address indexed _from, bytes32 indexed _id);
    event MintingCompleted(
        address indexed _from,
        bytes32 indexed _id,
        uint256[] _result
    );

    // Constructor inherits VRFConsumerBase
    constructor()
        ERC1155("https://ele5zqc2jqhz.usemoralis.com/nfts/{id}.json")
        VRFConsumerBase(vrfCoordinator, linkToken)
    {
        admin = payable(msg.sender);
    }

    // Requests randomness
    function mintPack() public payable returns (bytes32) {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK - fill contract with faucet"
        );
        require(msg.value >= maticFee, "Not enough MATIC included");
        bytes32 requestId = requestRandomness(keyHash, fee);
        requestToSender[requestId] = msg.sender;
        emit MintingInitiated(msg.sender, requestId);
        return requestId;
    }

    // Callback function used by VRF Coordinator
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        uint256[] memory _res = new uint256[](7);

        // give a DAO Token
        _res[0]++;

        // give 5 randomly colored dice
        for (uint256 i = 0; i < 5; i++) {
            _res[(uint256(keccak256(abi.encode(randomness, i))) % 6) + 1]++;
        }

        _mintBatch(requestToSender[requestId], tokenIds, _res, "");
        emit MintingCompleted(requestToSender[requestId], requestId, _res);
    }

    function getAccountBalances(address _account)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory _res = new uint256[](7);
        for (uint256 i = 0; i < 7; i++) {
            _res[i] = balanceOf(_account, i);
        }
        return _res;
    }

    function getUri(uint256 id) public view returns (string memory) {
        return uri(id);
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
