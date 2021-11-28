// console.log("SERVERURL: " + serverUrl)
// console.log("APPID: " + appId)
// console.log("CONTRACT_ADDRESS: " + CONTRACT_ADDRESS)

let web3;
let web3ws;
let contract;
let contractws;
let currentUser;
Moralis.start({ serverUrl, appId });

async function depositLink() {
    // sending 0.05 tokens with 18 decimals
    console.log("deposit LINK")
    const opt = {
        type: "erc20",
        amount: Moralis.Units.Token("0.05", "18"),
        receiver: CONTRACT_ADDRESS,                                     // Contract to deposit to
        contractAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"   // Mumbai LINK Token Address
    }
    let receipt = await Moralis.transfer(opt)
    console.log(receipt.events)
    alert("LINK Deposited")
}

async function withdrawAllLink() {
    const opt = { contractAddress: CONTRACT_ADDRESS, functionName: "withdrawAllLink", abi: contractAbi, params: {} }
    const receipt = await Moralis.executeFunction(opt)
    console.log(receipt.events)
    alert("LINK Widthdrawn")
}


async function withdrawAllMatic() {
    const opt = { contractAddress: CONTRACT_ADDRESS, functionName: "withdrawAllMatic", abi: contractAbi, params: {} }
    const receipt = await Moralis.executeFunction(opt)
    console.log(receipt.events)
    alert("MATIC Widthdrawn")
}

async function depositLinkToRollBones() {
    // sending 0.05 tokens with 18 decimals
    console.log("deposit LINK")
    const opt = {
        type: "erc20",
        amount: Moralis.Units.Token("0.05", "18"),
        receiver: ROLL_BONES_CONTRACT_ADDRESS,                                     // Contract to deposit to
        contractAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"   // Mumbai LINK Token Address
    }
    let receipt = await Moralis.transfer(opt)
    console.log(receipt.events)
    alert("LINK Deposited")
}

async function withdrawAllLinkFromRollBones() {
    const opt = { contractAddress: ROLL_BONES_CONTRACT_ADDRESS, functionName: "withdrawAllLink", abi: rollBonesContractAbi, params: {} }
    const receipt = await Moralis.executeFunction(opt)
    console.log(receipt.events)
    alert("LINK Widthdrawn")
}

async function withdrawAllMaticFromRollBones() {
    const opt = { contractAddress: ROLL_BONES_CONTRACT_ADDRESS, functionName: "withdrawAllMatic", abi: rollBonesContractAbi, params: {} }
    const receipt = await Moralis.executeFunction(opt)
    console.log(receipt.events)
    alert("MATIC Widthdrawn")
}

async function intitializeApp() {
    currentUser = Moralis.User.current();
    if (!currentUser) {
        currentUser = await Moralis.Web3.authenticate();
    }
    console.log(currentUser.get("ethAddress"));

    web3 = await Moralis.enableWeb3();

    console.log("completed")
}


intitializeApp();
