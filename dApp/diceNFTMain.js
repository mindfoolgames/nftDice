console.log("SERVERURL: " + serverUrl)
console.log("ALCHEMYURL: " + alchemyUrl)
console.log("APPID: " + appId)
console.log("CONTRACT_ADDRESS: " + CONTRACT_ADDRESS)

let web3;
let web3ws;
let contract;
let contractws;
let currentUser;
let diceNFTs = []
Moralis.start({ serverUrl, appId });


async function mintPack() {
    // const opt = { contractAddress: CONTRACT_ADDRESS, functionName: "mintPack", abi: contractAbi, params: {} }
    const opt = { contractAddress: CONTRACT_ADDRESS, functionName: "mintPack", abi: contractAbi, msgValue: Moralis.Units.ETH("0.25"), params: {} }
    // const opt = { contractAddress: ROLL_BONES_CONTRACT_ADDRESS, functionName: "getRandomNumber", abi: rollBonesContractAbi, msgValue: Moralis.Units.ETH("0.005"), params: {} }
    const receipt = await Moralis.executeFunction(opt)
    console.log(receipt.events)
}

async function intitializeApp() {
    currentUser = Moralis.User.current();
    if (!currentUser) {
        currentUser = await Moralis.Web3.authenticate();
    }
    console.log(currentUser.get("ethAddress"));
    console.log(`Contract Address:  ${CONTRACT_ADDRESS}`);

    // if (typeof web3 !== 'undefined') {
    //     console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
    // } else {
    // const provider = new Web3.providers.WebsocketProvider("wss://speedy-nodes-nyc.moralis.io/393be81211ebea010a154e1b/polygon/mumbai/ws")
    const provider = new Web3.providers.WebsocketProvider(alchemyUrl)
    web3ws = new Web3(provider);
    contractws = new web3ws.eth.Contract(contractAbi, CONTRACT_ADDRESS);
    // }

    web3 = await Moralis.enableWeb3();

    contractws.events.MintingInitiated({})
        .on('data', (event) => {
            console.log("MintingInitiated");
        })

    contractws.events.MintingCompleted({})
        .on('data', (event) => {
            if ((currentUser.get("ethAddress")).toUpperCase() == (event.returnValues._from).toUpperCase()) {
                alert("Minting Complete:" + event.returnValues._result + "\nFor:  " + event.returnValues._from)
                clearChildren("daoToken")
                clearChildren("app")
                loadNFTBalances(currentUser.get("ethAddress"))
            }
        })

    await loadNFTs(currentUser.get("ethAddress"))
    await loadNFTBalances(currentUser.get("ethAddress"))
}

async function loadNFTs(address) {
    // To pull from the server the "right" way... pull the URI from the contract.
    /*
    const opt = { contractAddress: CONTRACT_ADDRESS, functionName: "getUri", abi: contractAbi, params: { id: i.toString() } }
    const receipt = await Moralis.executeFunction(opt)
    // formatUri(receipt, i)
    */

    // Pulling it from the dApp server here for efficiency.
    // TokenId 0 will be for the DAO token
    for (let i = 0; i <= 6; i++) {
        // for local dev...
        // formatUri("http://127.0.0.1:5500/nfts/{id}.json", i)
        let jsn = await formatUri("/nfts/{id}.json", i)
        diceNFTs[i] = jsn
    }
    console.log(diceNFTs)
}

async function loadNFTBalances(address) {
    const opti = { contractAddress: CONTRACT_ADDRESS, functionName: "getAccountBalances", abi: contractAbi, params: { _account: address } }
    let accountBalances = await Moralis.executeFunction(opti)
    console.log("accountBalances: " + accountBalances)
    for (let i = 0; i <= 6; i++) {
        diceNFTs[i].quantity = accountBalances[i];
    }

    renderInventory()
}

async function formatUri(uri, i) {
    let lzs = '000000000000000000' + i
    let fmtSt = lzs.substr(lzs.length - 18)
    uri = uri.replace("{id}", fmtSt)

    let jsn =
        await fetch(uri)
            .then(response => response.json())
            .then(data => {
                // console.log(data)
                return data
            });
    return jsn
}

function clearChildren(el) {
    const parent = document.getElementById(el);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


function renderInventory() {
    // Render DAO Token
    let parent = document.getElementById("daoToken");
    let htmlString = `MFG NFT Dice DAO Token: ${diceNFTs[0].quantity}`;
    let hd = document.createElement("h4");
    hd.innerHTML = htmlString;
    parent.appendChild(hd);

    // Render Dice NFTs
    parent = document.getElementById("app");
    for (let i = 1; i <= 6; i++) {
        let htmlString = `
            <div class="card">
                <img class="card-img-top" src="${diceNFTs[i].image}" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${diceNFTs[i].name}</h5>
                    <p class="card-text">Your Balance: ${diceNFTs[i].quantity}</p>
                </div>
            </div>
            `;
        let col = document.createElement("div");
        // col.className = "col col-md-4";
        col.className = "col col-md-2";
        col.innerHTML = htmlString;
        parent.appendChild(col);
    }
}

intitializeApp();
