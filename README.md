# MFG NFT Dice for the Chainlink 2021 Fall Hackathon

# Intro

MFG NFT Dice allows you to buy packs of 6-sided dice represented as NFTs (ERC1155 standard) with randomly selected colors using Chainlink’s VRF features for on-chain randomness.

The Minting/Collection page shows the dice that you own and allows you to mint more by pressing the “Mint Pack” button. There is a 0.25 MATIC fee to mint a new pack. Each pack minted also grants you an MFG NFT Dice DAO Token for future Voting/DAO functionality.

The Play page randomly selects 5 dice from your collection (press “Pick Dice” to do a new random draw). The “Roll Dice” button engages a separate smart contract that will use Chainlink’s VRF features for on-chain randomness. There is a 0.005 MATIC fee to roll the dice.

The Admin page allows the admin to deposit/withdraw LINK from both smart contracts (DiceNFT.sol and RollBones.sol). It will also allow the admin to withdraw MATIC from both contracts. Note: anyone can deposit to a contract but only the admin can withdraw.


# Technologies Used:

ERC1155 Standard.
Metamask Wallet.
Polygon… contracts are deployed to the Polygon Mumbai Test network. The Polygon network was selected for better transaction speed and low gas fees (including low fees for Chainlink VRF).
Remix for smart contract deployment.
Moralis for web3 integration, metamask login, smart contract interaction, and static site hosting.
Alchemy web socket endpoints to enable the dApp to react to smart contract events.
The p5.js library was used to create the graphics for the dice and also to handle the UI and animation for rolling the dice on the play screen.


# Areas for improvement:

Use IPFS hosting for the NFTs.
DAO / Voting Functionality.
Convert to a web framework like React or Vue.
Shift from Remix to Brownie for a better development / testing workflow.
Because of time constraints RollBones.sol is just a reference implementation of a game. Create actual games that leverage the DiceNFT.sol smart contract.

# Reference Implementation / Live Demo

Deployed on the Polygon Mumbai Test Network.

Hosted using Moralis static hosting at https://ele5zqc2jqhz.usemoralis.com/index.html


