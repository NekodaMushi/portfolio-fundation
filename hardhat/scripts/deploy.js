const { ethers } = require('hardhat');
const fs = require('fs/promises');

async function main() {
  const AuctionHello = await ethers.getContractFactory('Auction');

  // start deployment, returning a promise that resolves to a contract object
  const auction_hello = await AuctionHello.deploy();
  await auction_hello.deployed();
  console.log('Contract deployed to: ', auction_hello.address);
  await writeDeployInfo(auction_hello);
}

async function writeDeployInfo(contract) {
  const data = {
    contract: {
      address: contract.address,
      signerAddress: contract.signer.address,
      abi: contract.interface.format(),
    },
  };

  const content = JSON.stringify(data, null, 2);
  await fs.writeFile('deployment.json', content, { encoding: 'utf-8' });
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
