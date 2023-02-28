const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const auctionId = urlParams.get('auctionId');
console.log('the auction id is', auctionId);

const auctionPage = document.querySelector('#auctionPage');

const displayWallet = document.getElementById('connectWallet');
const bidBtn = document.getElementById('bid');

const inputPrice = document.getElementById('price');
const submitBid = document.getElementById('bid-submit');
const balance = document.querySelector('#balance');
const popDisplayWallet = document.getElementById('popDisplayWallet');
const balanceAuction = document.getElementById('balanceAuction');
const popup = document.getElementById('popup');
const closeBtn = document.querySelector('.close');

const imgNFT = document.getElementById('imgNFT');
const bChain = document.querySelector('#blockchainName');
const cAddress = document.querySelector('#contractAddress');
const tID = document.querySelector('#tokenID');
const tStandard = document.querySelector('#tokenStandard');
const tDescription = document.querySelector('#tokenDescription');

const hiBid = document.querySelector('#highestBid');
const hiBidder = document.querySelector('#highestBidder');
const fPrice = document.querySelector('#floorPrice');

const nItem = document.querySelector('#nameItem');
const oInfo = document.querySelector('#ownerInfo');
const oID = document.querySelector('#ownerID');

// const saEndContain = document.querySelector('#sale_end_container')
const saEndValue = document.querySelector('#saEndValue');
// Not use for now
// console.log(saEndContain.value)
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

// select element for update UI
let parentRow = document.querySelector('.of__tr__row');

// array and stuff for update UI
let bidArray = [];
let walletArray = [];
let timeArray = [];
let timeDisplay = [];

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
let thousandBalance = 0;
// async function accessSimple() {
//   if (contract) return;
//   await provider.send('eth_requestAccounts', []);
//   const signer = provider.getSigner();
//   connectedAddress = await signer.getAddress();
//   contract = new ethers.Contract(address, abi, signer);
//   displayWallet.textContent = 'Connected';
// }
async function getAccess() {
  if (location.pathname === './index.html') {
    if (contract) return;
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    connectedAddress = await signer.getAddress();
    contract = new ethers.Contract(address, abi, signer);
    displayWallet.textContent = 'Connected';
  } else {
    if (contract) return;
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    connectedAddress = await signer.getAddress();
    console.log(connectedAddress);
    contract = new ethers.Contract(address, abi, signer);
    displayWallet.textContent = 'Connected';

    const balanceWeth = await provider.getBalance(connectedAddress);
    actualBalance = ethers.utils.formatEther(balanceWeth);
    thousandBalance = actualBalance * 1000;
    balance.textContent = actualBalance + ' WETH';
  }

  const walletConnected = function () {
    displayWallet.textContent = 'Connected';
    displayWallet.value = pKReduced(connectedAddress);

    popDisplayWallet.textContent = pKReduced(connectedAddress);
  };
  walletConnected();
  updateOffer();
  balanceUpdate(connectedAddress);
  displayHighestBidder();
}

// ******* CHECK IF LITTLE MALIN CHANGE HIS WALLET ACCOUNT, HENCE THE ADRESS ****

// Check for changes in the connected account
window.ethereum.on('accountsChanged', accounts => {
  displayWallet.textContent = 'Connect Wallet';
  displayWallet.addEventListener('click', function () {
    getAccess()
      .then(res => console.log(res))
      .catch(err => console.log(err));
  });
  // Handle the new accounts array
  console.log('New accounts:', accounts);
});

// setInterval(updateOffer, 5000);
// setInterval(updateUI, 20000);
// WEB3 --------------- END---------------

// Front---------------------------

// Practical fn
const pKReduced = publicKey =>
  publicKey.slice(0, 4) + '...' + publicKey.slice(-4);

// TIMER
if (auctionPage) {
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

  // -------REFUND & EXPENSE

  let userBalanceRefund;
  let userTotalExpense;

  function balanceUpdate(walletAddress) {
    fetch(`/api/auction/${walletAddress}/totalBidPerWallet`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        console.log(
          `-----Current Total refunds for ${walletAddress}: ${response.userGetBalanceBack}`
        );
        console.log(
          `-----Current Total Expense for ${walletAddress}: ${response.userExpense}`
        );

        userBalanceRefund = response.userGetBalanceBack;
        userTotalExpense = response.userExpense;
        console.log(userBalanceRefund);
        console.log(userTotalExpense);
      })
      .catch(err => console.error(err));
  }

  let popInBalance = 0;
  if (bidBtn) {
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

        userTotalExpense === 0
          ? (popInBalance = thousandBalance)
          : (popInBalance =
              thousandBalance - userTotalExpense + userBalanceRefund);
        popInBalance > thousandBalance
          ? (popInBalance = thousandBalance)
          : (popInBalance = popInBalance);
        balanceAuction.innerHTML = popInBalance;
        closeBtn.addEventListener('click', function () {
          popup.style.display = 'none';
        });
      } else {
        alert('Please connect your wallet');
      }
    });
  }
  if (submitBid) {
    submitBid.addEventListener('click', function (e) {
      e.preventDefault();
      let priceInput = Number(inputPrice.value);
      let walletInput = String(connectedAddress);
      let updatedBalance = 0;
      console.log(popInBalance);

      if (priceInput > popInBalance) {
        alert(`Your bid exceeds your current wallet balance: ${popInBalance}`);
        alert('warning you are too poor to surf on this website !');
        return;
      }
      if (priceInput < Number(highestBid.textContent)) {
        alert('BID REFUSED : You need to bid higher!');
        return;
      }
      inputPrice.value = '';
      updatedBalance = popInBalance - priceInput;
      balanceAuction.innerHTML = updatedBalance;
      alert('Successfully registered your bid offer, thank You');
      fetch(`/api/auction/${auctionId}/offer`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'post',
        body: JSON.stringify({
          walletId: walletInput,
          offerValue: priceInput,
          currentBalance: thousandBalance,
        }),
      })
        .then(res => res.json())
        .then(response => {
          console.log(response);
          alert(
            `Your new actual balance is ${updatedBalance} be careful Emmanuel Macron won't help you!`
          );
        })
        .then(() => {
          popup.style.display = 'none';
          parentRow.innerHTML = '';
          updateOffer();
        });
    });
  }

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
  if (labelDate) labelDate.textContent = dateDisplay;

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
        auction_img_link,
        highest_bidder,
      } = response[0];
      console.log(blockchain);

      bChain.innerHTML = blockchain;
      cAddress.innerHTML = pKReduced(token_contract);
      tID.innerHTML = token_id;
      tStandard.innerHTML = token_standard;
      tDescription.innerHTML = auction_desc;
      hiBidder.innerHTML = highest_bidder;
      nItem.innerHTML = auction_name;
      oID.innerHTML = pKReduced(owner_id);
      imgNFT.src = auction_img_link;
    })
    .catch(error => {
      console.error(error);
    });

  function displayHighestBidder() {
    fetch(`http://localhost:3000/api/auction/${auctionId}/highestBidder`)
      .then(res => res.json())
      .then(response => {
        console.log(response[0]);
        const topBidder = response[0].topbidder;
        hiBidder.innerHTML = pKReduced(topBidder);
      });
  }

  // FINAL ***HIGHEST BIDDER - WINNER *** FINAL
  if (saEndHour === '00' && saEndMin === '00' && saEndSec === '00') {
    fetch(`http://localhost:3000/api/auction/${auctionId}/highestBidderFinal`)
      .then(res => res.json())
      .then(response => {
        console.log(response[0]);
        const winner = response[0];
        oID.innerHTML = winner.wallet_id;
        oInfo.innerHTML = 'New happy Owner is ==>';
        alert('AUCTIONS ARE OVER');
      });
  }

  function updateUI() {
    // FETCHING for feeding updateOffer function
    // *** all offers ***
    fetch(`/api/auction/${auctionId}/allOffers`)
      .then(res => res.json())
      .then(response => {
        bidArray = response.map(obj => Object.values(obj)[0]);
        console.log(bidArray);
      });

    // *** all bidders ***
    fetch(`/api/auction/${auctionId}/allBidders`)
      .then(res => res.json())
      .then(response => {
        walletArray = response.map(obj => Object.values(obj)[0]);
        console.log(walletArray);
      });

    // *** time history ***
    fetch(`/api/auction/${auctionId}/timestamp`)
      .then(res => res.json())
      .then(response => {
        timeArray = response.map(obj => Object.values(obj)[0]);
        const dateNow = new Date();
        let differences = timeArray.map(time => {
          const dateArray = new Date(time);
          let diff = dateArray - dateNow;
          return diff;
        });
        console.log(differences);

        let timeBidded = differences.map(t => {
          const hours = Math.floor(Math.abs(t / 3600000));
          const min = Math.floor((Math.abs(t) % 3600000) / 60000);
          return { hours, min };
        });

        for (let i = 0; i < timeBidded.length; i++) {
          let timeString = timeBidded[i].hours + ':' + timeBidded[i].min;
          timeDisplay.push(timeString);
        }
      });

    // HIGHEST BID
    fetch(`/api/auction/${auctionId}/highOffer`)
      .then(res => res.json())
      .then(response => {
        console.log(response);
        var { max_offer_value } = response[0];
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
  }

  function updateOffer() {
    updateUI(); // for having food for updateOffer()
    const bidAr = bidArray.reverse();
    const timeAr = timeDisplay;
    const walletArr = walletArray.map(k => k.slice(0, 4) + '...' + k.slice(-4));

    parentRow.innerHTML = '';

    bidAr.forEach((elm, idx) => {
      const [hours, min] = timeAr[idx].split(':').map(str => parseInt(str));
      const html = `<div class="of__tr__row" id="trRow">
         <i class="fa-brands fa-ethereum price__eth"></i>
         <div class="of__tr__type of__tr__price price__eth">${bidAr[idx]}</div>
         <div class="of__tr__expir" id="TimeOffer">${
           hours - 1
         } hour and ${min} min ago</div>
         <div class="of__tr__from" id="fromOffer">${walletArr[idx]}</div>
      </div>`;
      parentRow.insertAdjacentHTML('afterend', html);
    });
  }
}
