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



document.addEventListener("DOMContentLoaded", function () {
  contract ? displayWallet.style.display = "none" : displayWallet.style.display = "block";
}); // Doesn't work for now

// Bid button
bidBtn.addEventListener("click", function () {
  popup.style.display = "block";
});

closeBtn.addEventListener("click", function () {
  popup.style.display = "none";
});


// -Back
// ---------LEFT id
// imgNFT

// blockchainName
// contractAdress
// tokenID
// tokenStandard
// tokenDescription



// // -------Right id
// nameItem
// ownerID
// saleEnd

// bid (already done above)


// // ------balancwallet
// balance
// // --------Graph (later)


// // --------Bottom
// priceOffer
// expirationOffer
// fromOffer

// priceTransfer
// expirationTransfer
// fromTransfer



const bChain = document.querySelector('#blockchainName');
const cAddress = document.querySelector('#contractAddress');
const tID = document.querySelector('#tokenID');
const tStandard = document.querySelector('#tokenStandard');
const tDescription = document.querySelector('#tokenDescription');

const nItem = document.querySelector('#nameItem');
const oID = document.querySelector('#ownerID');

const saEnd = document.querySelector('#saleEnd');
// const saEndDay = document.querySelector('#endDay');
const saEndHour = document.querySelector('#endHour');
const saEndMin = document.querySelector('#endMin');
const saEndSec = document.querySelector('#endSec');

const balance = document.querySelector('#balance');

const pOffer = document.querySelector('#priceOffer');
const eOffer = document.querySelector('#expirationOffer');
const fOffer = document.querySelector('#fromOffer');

const pTransfer = document.querySelector('#priceTransfer');
const eTransfer = document.querySelector('#expirationTransfer');
const fTransfer = document.querySelector('#fromTransfer');



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
    saEnd.textContent = '';
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


// TEST


// fetch('http://localhost:3000/api/auctionvalues/auctionId')
//   .then(res => res.json())
//   .then(response => {
//     console.log(response);
//     bChain.innerHTML = response;

//   });


const auctionId = 123;

// fetch(`http://localhost:3000/api/auctionvalues/${auctionId}`)
//   .then(res => res.json())
//   .then(response => {
//     bChain.innerHTML = response.Nft.blockchain;
//     cAddress.innerHTML = response.Nft.contractAddress;
//     tID.innerHTML = response.Nft.tokenId;
//     tStandard.innerHTML = response.Nft.tokenStandard;
//     tDescription.innerHTML = response.Nft.description;
//     nItem.innerHTML = response.Nft.nameOfItem;


//     oID.innerHTML = response.Nft.owner;
//     saEnd.innerHTML = response.Timer.saleEnd;



//   });

// fetch(`http://localhost:3000/api/biddervalues/${auctionId}`)
//   .then(res => res.json())
//   .then(response => {
//     balance.innerHTML = response.Bidder.balanceWallet;
//   });

// fetch(`http://localhost:3000/api/offervalues/${auctionId}`)
//   .then(res => res.json())
//   .then(response => {
//     pOffer.innerHTML = response.Offers.price;
//     eOffer.innerHTML = response.Offers.expiration;
//     fOffer.innerHTML = response.Offers.from;

//     pTransfer.innerHTML = response.Transfers.price;
//     eTransfer.innerHTML = response.Transfers.expiration;
//     fTransfer.innerHTML = response.Transfers.from;
//   });


// // TEST DATABASE

// fetch(`http://localhost:3000/api/auctions/`)
//   .then(res => res.json())
//   .then(response => {
//     console.log(response);

//   });

// fetch(`http://localhost:3000/api/auction/4`)
//   .then(res => res.json())
//   .then(response => {
//     console.log(response);

//   });

// 16 feb test

fetch(`http://localhost:3000/api/auction/3/offer`, {
  headers: {
    'Content-Type': 'application/json'
  },
  method: "post",
  body: JSON.stringify({ auctionId: 3, walletId: '0x9e9b41c0f0d9886d1af194ae5b6f5b6f5d6c5aa6', offerValue: 0.77 })
})
  .then(res => res.json())
  .then(response => {
    console.log(response);

  });


// Might use later

// fetch('api/expiration-duration')
//   .then(res => res.json())
//   .then(response => {
//     const expirationDuration = response.duration * 1000;
//     startAuctionTimer(expirationDuration);
//   })



















// const el = document.querySelector('#nameItem');
// fetch('http://localhost:3000/api/auctionvalues/123')
//   .then(res => res.json())
//   .then(response => {
//     console.log(response);
//     el.target.innerHTML = response.title

//   })


// fetch('http://localhost:3000/')
















  //   const el = document.querySelector("#name__item");
// el.addEventListener("click", function(el){
//   fetch('http://localhost:3000/toto')
//   .then(res => res.json())
//   .then(response => {
//     console.log(response.title)
//   });
// }, false);












// Change text value of div

// fetch('http://localhost:3000/auction')
//   .then(res => res.text())
//   .then(html => {
//     document.querySelector('.name__item').innerHTML = 'fabien';
//   });


//  Get text value of div using its class

// fetch('http://localhost:3000/auction')
//    .then(res => res.text())
//    .then(html => {
//    //const parser = new DOMParser();
//    const doc = parser.parseFromString(html, 'text/html');
//    const nameItem = doc.querySelector('.name__item');
//    console.log(nameItem.textContent);
//   })


// Last test

// const el = document.querySelector('#name__item');
// el.addEventListener('click', function (event) {
//   fetch('http://localhost:3000/api/auctionvalues/123')
//     .then(res => res.json())
//     .then(response => {
//       console.log(response);
//       event.target.innerHTML = response.title

//     })

// }, false)


// const el1 = document.querySelector('#temp1');
// console.log(el1);

// const elCausing = document.querySelector('#temp2');
// elCausing.addEventListener('click', function (e) {
//   fetch('http://localhost:3000/api/saleends')
//     .then(res => res.json())
//     .then(response => {
//       console.log(response);
//       el1.innerHTML = response.title

//     });
// }, false);

