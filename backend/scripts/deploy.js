import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Anchor contract...");
  
  const Anchor = await ethers.getContractFactory("Anchor");
  const anchor = await Anchor.deploy();
  
  await anchor.waitForDeployment();
  
  const address = await anchor.getAddress();
  console.log(`Anchor contract deployed to: ${address}`);
  
  // Save the address to .env file
  console.log(`\nAdd this to your .env file:`);
  console.log(`ANCHOR_CONTRACT_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });