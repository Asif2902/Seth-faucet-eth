require('dotenv').config();
const web3 = new Web3(window.ethereum);
const contractAddress = '0x...GaslessFacet contract address...';
const contractAbi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "fossilCooldowns",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_recipient",
				"type": "address"
			}
		],
		"name": "requestEth",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
const ownerAddress = process.env.OWNER_ADDRESS;
const ownerPrivateKey = process.env.OWNER_PRIVATE_KEY;

const contract = new web3.eth.Contract(contractAbi).at(contractAddress));

const requestForm = document.getElementById('request-form');
const addressInput = document.getElementById('address');
const requestBtn = document.getElementById('request-btn');
const transactionStatus = document.getElementById('transaction-status');

requestBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const address = addressInput.value.trim();
    if (!address) return;

    const txCount = await web3.eth.getTransactionCount(ownerAddress);
    const tx = {
        from: ownerAddress,
        to: contractAddress,
        value: 0,
        gas: 2000000,
        gasPrice: web3.utils.toWei('20', 'gwei'),
        nonce: txCount,
        data: contract.methods.requestEth(address).encodeABI(),
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, ownerPrivateKey);
    const txHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    transactionStatus.innerHTML = `Transaction complete! <a href="https://sepolia.etherscan.io/tx/${txHash}" target="_blank">View on Etherscan</a>`;
});