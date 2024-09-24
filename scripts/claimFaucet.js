require("dotenv").config();
const { ethers } = require("ethers");

const faucetAddress = "your_faucet_contract_address_here";
const faucetABI = [
  // The ABI of the Faucet contract
  "function claimFaucet() external",
];

async function claimForUser(userAddress) {
  const provider = new ethers.providers.JsonRpcProvider(process.env.NETWORK_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const faucetContract = new ethers.Contract(faucetAddress, faucetABI, wallet);

  try {
    const tx = await faucetContract.claimFaucet({ from: userAddress });
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log(`Claimed faucet for: ${userAddress}`);
  } catch (error) {
    console.error("Error claiming faucet:", error);
  }
}

const userAddress = "user_ethereum_address";
claimForUser(userAddress);
