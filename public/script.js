const auctionId = 5;

const displayWallet = document.getElementById('connectWallet');
const bidBtn = document.getElementById('bid');

const inputPrice = document.getElementById('price');
const submitBid = document.getElementById('bid-submit');
const balance = document.querySelector('#balance');
const popDisplayWallet = document.getElementById('popDisplayWallet');
const balanceAuction = document.getElementById('balanceAuction');
const popup = document.getElementById('popup');
const closeBtn = document.querySelector('.close');

const bChain = document.querySelector('#blockchainName');
const cAddress = document.querySelector('#contractAddress');
const tID = document.querySelector('#tokenID');
const tStandard = document.querySelector('#tokenStandard');
const tDescription = document.querySelector('#tokenDescription');

const hiBid = document.querySelector('#highestBid');
const fPrice = document.querySelector('#floorPrice');

const nItem = document.querySelector('#nameItem');
const oInfo = document.querySelector('#ownerInfo');
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

// array and stuff for update UI
let bidArray = [];
let walletArray = [];
let timeArray = [];

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

const address = '0xCFE3441a10A3F956f30ca5A8EF928A42505f02A7';
let contract = null;
let connectedAddress = null;
let actualBalance = 0;
let cheatedBalance = 0;

async function getAccess() {
  if (contract) return;
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();
  connectedAddress = await signer.getAddress();
  contract = new ethers.Contract(address, abi, signer);

  // const eventLog = document.getElementById('events');
  // contract.on('End', (highestBidder, highestBid) => {
  //   eventLog.append(
  //     `Auction ended with a winner: ${highestBidder} with an amount of ${highestBid}`
  //   );
  // });

  // console.log(connectedAddress);

  const balanceWeth = await provider.getBalance(connectedAddress);
  actualBalance = ethers.utils.formatEther(balanceWeth);
  cheatedBalance = actualBalance * 1000;
  balance.textContent = actualBalance + ' WETH';

  // displayWallet.style.display = 'none';
  const walletConnected = function () {
    // PUT BACK LATER --------------
    // alert("Wallet connected to auction ");
    // });
    displayWallet.textContent = 'Connected';
    displayWallet.value = pKReduced(connectedAddress);

    popDisplayWallet.textContent = pKReduced(connectedAddress);
    // balanceAuction.textContent = actualBalance;
  };
  // displayWallet.style.display = 'none';
  walletConnected();
  // console.log(balanceWeth);
  // console.log(actualBalance)
  console.log(cheatedBalance);

  // setTimeout(() => {
  //   walletConnected.removeEventListener('', walletConnected);
  // }, 3000);
}

// WEB3 --------------- END---------------

// Front---------------------------

// Practical fn
const pKReduced = publicKey =>
  publicKey.slice(0, 4) + '...' + publicKey.slice(-4);

// ----

document.addEventListener('DOMContentLoaded', function () {
  contract
    ? (displayWallet.style.display = 'none')
    : (displayWallet.style.display = 'block');
}); // Doesn't work for now

// TIMER
fetch(`/api/auction/${auctionId}/timer`)
  .then(res => res.json())
  .then(auctionData => {
    console.log(auctionData);

    const endTimeAuction = new Date(auctionData.sale_ends);

    const timeCount = function () {
      const now = new Date().getTime();
      const auctionTimer = endTimeAuction - now;

      if (auctionTimer <= 0) {
        clearInterval(timer);
        bidBtn.classList.add('hidden');

        return;
      }

      const hours = Math.floor(
        (auctionTimer % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (auctionTimer % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((auctionTimer % (1000 * 60)) / 1000);

      saEndHour.textContent = hours.toString().padStart(2, '0');
      saEndMin.textContent = minutes.toString().padStart(2, '0');
      saEndSec.textContent = seconds.toString().padStart(2, '0');
      saEndValue.textContent = '';
    };

    const timer = setInterval(timeCount, 1000);
  })
  .catch(error => {
    console.error(error);
  });

// Submit bid - BID NOW -------- POST

// console.log(actualBalance);
// let cheatedBalance = parseFloat(actualBalance * 1000);
// console.log(cheatedBalance);
// let currentBalance = Number(actualBalance);
// console.log(typeof currentBalance);
// console.log(currentBalance);

// Bid button Pop up
bidBtn.addEventListener('click', function () {
  if (contract) {
    // console.log(actualBalance);
    popup.style.display = 'block';
    closeBtn.addEventListener('click', () => {
      popup.style.display = 'none';
    });
    popDisplayWallet.textContent = pKReduced(connectedAddress);
    balanceAuction.classList.add('neon');
    balanceAuction.innerHTML = cheatedBalance;
    closeBtn.addEventListener('click', function () {
      popup.style.display = 'none';
    });
  } else {
    alert('Please connect your wallet');
  }
});

submitBid.addEventListener('click', function () {
  let priceInput = Number(inputPrice.value);
  let walletInput = String(connectedAddress);
  // balanceAuction.value = cheatedBalance;
  // console.log(cheatedBalance);

  console.log('coucou');
  // console.log(currentBalanceNumber);
  if (priceInput > cheatedBalance) {
    alert(`Your bid exceeds your current wallet balance: ${cheatedBalance}`);
    alert('warning you are too poor to surf on this website !');
    return;
  }
  alert('Successfully registered your bid offer, thank You');
  fetch(`/api/auction/${auctionId}/offer`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'post',
    body: JSON.stringify({ walletId: walletInput, offerValue: priceInput }),
  })
    .then(res => res.json())
    .then(response => {
      console.log(response);
      const updatedBalance = cheatedBalance - priceInput;
      alert(
        `Your new actual balance is ${updatedBalance} be careful Macron won't save you!`
      );
      balanceAuction.innerHTML = updatedBalance;
    })
    .then(() => {
      // updateUI();
    });


});

// ********************************* ///
// ############# JONAS STUFF AND MINE ############
/////////////////////////////////////////
// const parentRow = document.querySelector('.of__tr__row');
// const html = `<i class="fa-brands fa-ethereum price__eth"></i>
//       <div class="of__tr__type of__tr__price price__eth">${priceInput}</div>
//       <div class="of__tr__time" id="offerTime">${priceInput}</div>
//       <div class="of__tr__from" id="fromOffer">${walletInput}</div>
//     </div>`;
// parentRow.insertAdjacentHTML('beforeend', html);

// const displayMovements = function (movements, sort = false) {
//   containerMovements.innerHTML = '';

//   const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

//   movs.forEach(function (mov, i) {
//     const type = mov > 0 ? 'deposit' : 'withdrawal';

//     const html = `
//       <div class="movements__row">
//         <div class="movements__type movements__type--${type}">${
//       i + 1
//     } ${type}</div>
//         <div class="movements__value">${mov}€</div>
//       </div>
//     `;

//     containerMovements.insertAdjacentHTML('afterbegin', html);
//   });
// };

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
fetch(`/api/auction/${auctionId}/details`)
  .then(res => res.json())
  .then(response => {
    console.log(response);
    const {
      auction_id,
      token_id,
      token_contract,
      created_on,
      sale_starts,
      sale_ends,
      blockchain,
      token_standard,
      owner_id,
      auction_name,
      auction_desc,
    } = response[0];
    console.log(blockchain);

    bChain.innerHTML = blockchain;
    cAddress.innerHTML = pKReduced(token_contract);
    tID.innerHTML = token_id;
    tStandard.innerHTML = token_standard;
    tDescription.innerHTML = auction_desc;
    nItem.innerHTML = auction_name;
    oID.innerHTML = pKReduced(owner_id);
    // balanceAuction.textContent = 100;

    // saEndValue.innerHTML = sale_ends;
  })
  .catch(error => {
    console.error(error);
  });

// ***HIGHEST BIDDER WHO ARE YOU***
if (saEndHour === '00' && saEndMin === '00' && saEndSec === '00') {
  fetch(`http://localhost:3000/api/auction/${auctionId}/highestBidder`)
    .then(res => res.json())
    .then(response => {
      console.log(response[0]);
      const winner = response[0];
      oID.innerHTML = winner.wallet_id;
      oInfo.innerHTML = 'New happy Owner is ==>';
    });
}

// FETCHING for feeding updateUI function
// *** all offers ***
fetch(`/api/auction/${auctionId}/allOffers`)
  .then(res => res.json())
  .then(response => {
    // const values = arr.map(obj => Object.values(obj)[0]);
    bidArray = response.map(obj => Object.values(obj)[0]);
    console.log(bidArray);
  });

// *** all bidders ***
fetch(`/api/auction/${auctionId}/allBidders`).then(res => res.json());
// .then(response => console.log(response));

// *** time history ***
fetch(`/api/auction/${auctionId}/timestamp`).then(res => res.json());
// .then(response => console.log(response));
// HIGHEST BID
fetch(`/api/auction/${auctionId}/highOffer`)
  .then(res => res.json())
  .then(response => {
    console.log(response);
    const { max_offer_value } = response[0];
    hiBid.innerHTML = max_offer_value;
  })
  .catch(error => {
    console.error(error);
  });

// FLOOR PRICE
fetch(`/api/auction/${auctionId}/lowOffer`)
  .then(res => res.json())
  .then(response => {
    console.log(response);
    const { min_offer_value } = response[0];
    fPrice.innerHTML = min_offer_value;
  })
  .catch(error => {
    console.error(error);
  });

const updateUI = () => {};
