const { json } = require('express');
const express = require('express');
const router = express.Router();
const path = require('path');

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'changeme',
  port: 5432,
})



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/auction', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'auction.html'));
});





// TEST Bellow
// router.get('/auction', function (req, res, next) {
//   res.json('200', { title: 'jason' });
// });



// 

// router.get('/auction', (req, res) => {
//   res.status(200).send('Hello from the server side!')
// })

// router.get('/api/auctionvalues/:auctionId', function (req, res, next) {
//   res.json('200', { title: 'flambi', id: req.params.auctionId });
// });

// router.get('/api/saleends', function (req, res, next) {
//   res.json('200', { title: 'jerome' });
// });


module.exports = router;

// router.get('/auction/id=')



// number_view correspond to days hours min

router.get('/api/auctionvalues/:auctionId', function (req, res, next) {
  res.status(200).json(articleInfoAPI);
});

router.get('/api/biddervalues/:auctionId', function (req, res, next) {
  res.status(200).json(bidderUserAPI);
});

router.get('/api/offervalues/:auctionId', function (req, res, next) {
  res.status(200).json(offerTransfertAPI);
});



router.get('/api/auctions/', function
  (req, res, next) {
  pool.query(`SELECT * FROM auction WHERE sale_starts < now() AND sale_ends > now()`, (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
});

router.get('/api/auction/:auctionId', function
  (req, res, next) {

  if (req.params.auctionId) {
    pool.query(`SELECT * FROM auction WHERE auction_id=${req.params.auctionId}`, (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  }
});



// NEW ROUTE

router.get('/api/auction/:auctionId/offer', function
  (req, res, next) {

  if (req.params.auctionId) {
    pool.query(`SELECT * FROM offer WHERE auction_id=${req.params.auctionId}`, (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  }
});

// POST
router.post('/api/auction/:auctionId/offer', function (req, res) {
  console.log('---------1-');
  console.log(req.body);
  console.log('----------');

  console.log(req.params);
  console.log('----------');
  if (req.body.walletId) {
    pool.query(`SELECT bidder_id FROM bidder WHERE wallet_id='${req.body.walletId}'`, (error, results) => {
      if (error) {
        throw error;
      }

      if (results.rows.length === 0) {

        res.status(400).json({ error: 'Invalid wallet address' });
      } else {
        const bidderId = results.rows[0].id;

        pool.query(`INSERT INTO offer (auction_id, bidder_id, created_on) VALUES (${auctionId}, ${bidderId}, now(), ${offerValue}) RETURNING *`,
          (error, results) => {
            if (error) {
              throw error;
            }
            res.status(201).json(results.rows[0]);
          }
        );
      }
    });
  }
});





// FIRST POST ------

// router.post('/api/auction/:auctionId/offer', function (req, res, next) {
//   const { auctionId } = req.params;
//   const { walletId, createdOn, offerValue } = req.body;

//   pool.query(`SELECT bidder_id FROM bidder WHERE wallet_id=${walletId} AND auction_id=${auctionId}`, (error, results) => {
//     if (error) {
//       throw error;
//     }

//     if (results.rows.length === 0) {

//       res.status(400).json({ error: 'Invalid wallet address' });
//     } else {
//       const bidderId = results.rows[0].id;

//       pool.query(`INSERT INTO offer (auction_id, bidder_id, created_on) VALUES (${auctionId}, ${bidderId}, ${createdOn}, ${offerValue}) RETURNING *`,
//         (error, results) => {
//           if (error) {
//             throw error;
//           }
//           res.status(201).json(results.rows[0]);
//         }
//       );
//     }
//   });
// });
























// router.get('/api/auction/:auctionId', function (req, res, next) {
//   pool.query('SELECT * FROM auction')
// })


const articleInfoAPI = {
  'Nft': {
    'blockchain': 'Ethereum',
    'contractAddress': 'Data_from_anto-blockchain',
    'tokenId': 'Data_from_anto-blockchain',
    'tokenStandard': 'ERC-721',
    'description': 'Here a description of item',
    'nameOfItem': 'nameData',
    'owner': 'WalletOwner',
  },
  'Timer': {
    'saleEnd': 'data',
  }
};
// Not sure we need numberTimeCount

// changed articleInfoAPI to create bidderUserAPI
const bidderUserAPI = {
  'Bidder': {
    'userId': 'publicKey',
    'balanceWallet': 2,
    'actualBid': 0.3
  }
};

// Added ItemValue : basevValue & bidderUserAPI

const offerTransfertAPI = {
  'ItemValue': {
    'baseValue': 0.5,
    'actualValue': 2.3,
  },
  'Offers': {
    'price': 'DataPrice',
    'expiration': 'DataTime',
    'from': 'WalletPublicKey'
  },
  'Transfers': {
    'price': 'DataPrice',
    'expiration': 'DataTime',
    'from': 'WalletPublicKey'
  }
};




// Graph (Futur project)













// router.get('/auction', (req, res) => {
//   res.json('200', { title: 'fab' });

// router.get('/api/auctionvalues', function (req, res, next) {
//   res
//     .status('200')
//     .json(
//       { bidValue: 80, bidId: 123, bidAuction: 890 }
//     );
// });


// Before

// router.get('/api/auctionvalues', function (req, res, next) {
//   res.json('200', { title: 'francois' });
// });



// Version before 14 feb

// const articleInfoAPI = {
//   'Details': {
//     'blockchain': 'Ethereum',
//     'contractAddress': 'Data_from_anto-blockchain',
//     'tokenId': 'Data_from_anto-blockchain',
//     'tokenStandard': 'ERC-721',
//   },
//   'Description': {
//     'text': 'Here a description of item'
//   },
//   'Identification': {
//     'nameOfItem': 'nameData',
//     'owner': 'WalletOwner'
//   },
//   'Timer': {
//     'saleEnd': 'data',
//     'numberDecompte': 'data'
//   },
//   'BidPopUp': {
//     'balanceWallet': 'nbEtherData'
//   }
// };

