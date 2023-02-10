const displayWallet = document.getElementById("connectWallet");

const bidBtn = document.getElementById("bid");
const popup = document.getElementById("popup");
const closeBtn = document.querySelector(".close");


const provider = new ethers.providers.Web3Provider(window.ethereum);
const abi = [
  'constructor()',
  'event Bid(address indexed sender, uint256 amount)',
  'event End(address highestBidder, uint256 highestBid)',
  'event Start()',
  'event Withdraw(address indexed bidder, uint256 amount)',
  'function bid() payable',
  'function bids(address) view returns (uint256)',
  'function end()',
  'function endAt() view returns (uint256)',
  'function ended() view returns (bool)',
  'function highestBid() view returns (uint256)',
  'function highestBidder() view returns (address)',
  'function seller() view returns (address)',
  'function start(uint256 startingBid)',
  'function started() view returns (bool)',
  'function withdraw() payable',
];

const address = '0xe062e42b04f85D3FE52eE6ac484745017eA8A8E0';
let contract = null;

async function getAccess() {
  if (contract) return;
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();
  contract = new ethers.Contract(address, abi, signer);

  const eventLog = document.getElementById('events');
  contract.on('End', (highestBidder, highestBid) => {
    eventLog.append(
      `Auction ended with a winner: ${highestBidder} with an amount of ${highestBid}`
    );
  });

  displayWallet.style.display = "none";
  const walletConnected = function () {
    alert('Wallet connected to D-Auction');
  }
  walletConnected();
  setTimeout(() => {
    walletConnected.removeEventListener('', walletConnected);
  }, 3000);
  
}


// Front



document.addEventListener("DOMContentLoaded", function() {
  contract ? displayWallet.style.display = "none" : displayWallet.style.display = "block";
}); // Doesn't work for now

// Bid button
bidBtn.addEventListener("click", function() {
  popup.style.display = "block";
});

closeBtn.addEventListener("click", function() {
  popup.style.display = "none";
});
