const displayWallet = document.getElementById("connectWallet");
const bidBtn = document.getElementById("bid");

const inputPrice = document.getElementById('price');
const submitBid = document.getElementById("bid-submit");
const balance = document.querySelector('#balance');
const popDisplayWallet = document.getElementById('popDisplayWallet');
const popup = document.getElementById("popup");
const closeBtn = document.querySelector(".close");


const bChain = document.querySelector('#blockchainName');
const cAddress = document.querySelector('#contractAddress');
const tID = document.querySelector('#tokenID');
const tStandard = document.querySelector('#tokenStandard');
const tDescription = document.querySelector('#tokenDescription');

const nItem = document.querySelector('#nameItem');
const oID = document.querySelector('#ownerID');

const saEndValue = document.querySelector('#saEndValue');
// Not use for now

// const saEndDay = document.querySelector('#endDay');
const saEndHour = document.querySelector('#endHour');
const saEndMin = document.querySelector('#endMin');
const saEndSec = document.querySelector('#endSec');


const pOffer = document.querySelector('#priceOffer');
const eOffer = document.querySelector('#expirationOffer');
const fOffer = document.querySelector('#fromOffer');

const pTransfer = document.querySelector('#priceTransfer');
const eTransfer = document.querySelector('#expirationTransfer');
const fTransfer = document.querySelector('#fromTransfer');


// WEB3 ----------------- START

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
let connectedAddress = null;

async function getAccess() {
  if (contract) return;
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();
  connectedAddress = await signer.getAddress();
  contract = new ethers.Contract(address, abi, signer);

  const eventLog = document.getElementById('events');
  contract.on('End', (highestBidder, highestBid) => {
    eventLog.append(
      `Auction ended with a winner: ${highestBidder} with an amount of ${highestBid}`
    );
  });

  const balanceWeth = await provider.getBalance(connectedAddress);
  const actualBalance = ethers.utils.formatEther(balanceWeth);
  balance.textContent = actualBalance + ' WETH';

  displayWallet.style.display = "none";
  const walletConnected = function () {


    // PUT BACK LATER --------------
    // alert("Wallet connected to auction ");


    popDisplayWallet.textContent = pKReduced(connectedAddress);

  }
  walletConnected();
  // setTimeout(() => {
  //   walletConnected.removeEventListener('', walletConnected);
  // }, 3000);

};

// WEB3 --------------- END


// Front

// Practical fn
const pKReduced = publicKey => publicKey.slice(0, 4) + '...' + publicKey.slice(-4);


// ----

document.addEventListener("DOMContentLoaded", function () {
  contract ? displayWallet.style.display = "none" : displayWallet.style.display = "block";
}); // Doesn't work for now

// Bid button Pop up

bidBtn.addEventListener("click", function () {
  if (contract) {
    popup.style.display = "block";
    popDisplayWallet.textContent = pKReduced(connectedAddress);
    popDisplayWallet.classList.add('neon');

  }
  else {
    alert("Please connect your wallet")
  }
});

// Submit bid - BID NOW --------

submitBid.addEventListener("click", function () {
  // NEED TO DO SOMETHING WITH THAT ------
  // if (contract) {
  //   alert('oook')
  //   console.log('oook');

  // }
  // else {
  //   alert("Please connect your wallet")
  // }

  let priceInput = Number(inputPrice.value);
  let walletInput = String(connectedAddress);
  fetch(`http://localhost:3000/api/auction/3/offer`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: "post",
    body: JSON.stringify({ walletId: walletInput, offerValue: priceInput })
  })
    .then(res => res.json())
    .then(response => {
      console.log(response);

    });
});


closeBtn.addEventListener("click", function () {
  popup.style.display = "none";
});


// TIMER


const startAuctionTimer = function () {
  const startTimeAuction = new Date(Date.now());
  const expirationTime = 2; //WRITE HERE - Get from API
  const auctionDuration = expirationTime * 60 * 60 * 1000; // 2h -> m sec

  const timeCount = function () {
    const now = new Date().getTime();
    const auctionTimer = endTimeAuction - now;

    if (auctionTimer <= 0) {
      clearInterval(timer);
      // End of auction - Futur Implementation
      return;
    }

    const hours = Math.floor((auctionTimer % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((auctionTimer % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((auctionTimer % (1000 * 60)) / 1000);

    saEndHour.textContent = hours.toString().padStart(2, '0');
    saEndMin.textContent = minutes.toString().padStart(2, '0');
    saEndSec.textContent = seconds.toString().padStart(2, '0');
    saEndValue.textContent = '';
  };

  const endTimeAuction = startTimeAuction.getTime() + auctionDuration;
  timeCount();
  const timer = setInterval(timeCount, 1000);
};

startAuctionTimer();



// Date & Time
const labelDate = document.querySelector('#dateHistory');
const now = new Date();
const options = {
  day: 'numeric',
  month: 'long',
  hour: 'numeric',
  minute: 'numeric',
};
const locale = navigator.language;
const dateDisplay = new Intl.DateTimeFormat(locale, options).format(now);
labelDate.textContent = dateDisplay;

// Base Information --
fetch(`http://localhost:3000/api/auction/1`)
  .then(res => res.json())
  .then(response => {
    console.log(response);
    const { auction_id, token_id, token_contract, created_on, sale_starts, sale_ends, blockchain, token_standard, owner_id, auction_name, auction_desc } = response[0];
    console.log(blockchain);


    bChain.innerHTML = blockchain;
    cAddress.innerHTML = pKReduced(token_contract);
    tID.innerHTML = token_id;
    tStandard.innerHTML = token_standard;
    tDescription.innerHTML = auction_desc;
    nItem.innerHTML = auction_name;
    oID.innerHTML = pKReduced(owner_id);

    // saEndValue.innerHTML = sale_ends;


  });






















