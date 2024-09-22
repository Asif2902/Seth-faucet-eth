document.addEventListener('DOMContentLoaded', function () {
    const requestBtn = document.getElementById('request-btn');
    const addressInput = document.getElementById('address');
    const transactionStatus = document.getElementById('transaction-status');
    const errorBox = document.getElementById('error-box');
    const errorList = document.getElementById('error-list');

    const ownerAddress =
    '0xed77175d14c9dd9e8268bfe56c2f2933a0abf2c0ab8c0dc70fa54912a20b0cb5';  //
    Replace with your actual owner address
    const ownerPrivateKey = '0xA213F310605158e94DF9757677cD369360d4E657';  // Replace with your actual private key
    const contractAddress = '0x0F871465B479C951d46c539E0Fba5ec1f36B63Af';

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

    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(contractAbi, contractAddress);

        requestBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('Request button clicked'); // Check if this shows in console

            const address = addressInput.value.trim();
            if (!address) return;

            try {
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
                const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

                transactionStatus.innerHTML = `Transaction complete! <a href="https://sepolia.etherscan.io/tx/${receipt.transactionHash}" target="_blank">View on Etherscan</a>`;
            } catch (error) {
                console.error('Error:', error);
                const errorElement = document.createElement('li');
                errorElement.textContent = error.message;
                errorList.appendChild(errorElement);
                errorBox.style.display = 'block';
            }
        });
    } else {
        console.error('No Ethereum provider found. Install MetaMask or another wallet.');
    }
});
