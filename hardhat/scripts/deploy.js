const { ethers } = require('hardhat');
const fs = require('fs/promises');

async function main() {
  const Transfer = await ethers.getContractFactory('Transfer');

  // start deployment, returning a promise that resolves to a contract object
  const transfer = await Transfer.deploy();
  await transfer.deployed();
  console.log('Contract deployed to: ', transfer.address);
  await writeDeployInfo(transfer);
}

// Utility function, to write the basic info of deployment in a separate file
// Useful for keeping track of the address and abi of contract
async function writeDeployInfo(contract) {
  const data = {
    contract: {
      address: contract.address,
      signerAddress: contract.signer.address,
      abi: contract.interface.format(),
    },
  };

  const content = JSON.stringify(data, null, 2);
  await fs.writeFile('deploymentTransfer.json', content, { encoding: 'utf-8' });
}

// calling the function to deploy the smart contract
// chain it with proper error handling
main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
