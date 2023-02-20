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
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/auction', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'auction.html'));
});

module.exports = router;



// Base Information ---
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

// Highest bid & Floor Price

router.get('/api/auction/:auctionId/highOffer', function (req, res, next) {
  if (req.params.auctionId) {
    pool.query(`SELECT auction_id, MAX(offer_value) as max_offer_value FROM offer GROUP BY auction_id`, (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    });
  }
});

// router.get('/api/auction/:auctionId/lowOffer', function (req, res, next) {
//   if (req.params.auctionId) {
//     pool.query(`SELECT auction_id, MIN(offer_value) as min_offer_value FROM offer WHERE auction_id=${req.params.auctionId} $1 GROUP BY auction_id`, (error, results) => {
//       if (error) {
//         throw error;
//       }
//       res.status(200).json(results.rows);
//     });
//   }
// });


router.get('/api/wallet/:walletId', function (req, res) {
  res.json({ currentBalance: 1000 });
});

// -----------------------


// POST ------------------------ Need to optimize
router.post('/api/auction/:auctionId/offer', function (req, res) {
  const walletId = req.body.walletId;
  const offerValue = req.body.offerValue;

  // Sum of bid from this user
  pool.query(`SELECT SUM(offer_value) AS total_bids FROM offer o JOIN bidder b ON o.bidder_id = b.bidder_id WHERE b.wallet_id='${walletId}'`, (error, results) => {
    if (error) {
      throw error;
    }

    const totalBids = results.rows[0].total_bids || 0;
    let currentBalance;

    if (offerValue > currentBalance - totalBids) {
      res.status(400).json({ error: 'Your bid exceeds your current wallet balance' });
    } else {
      pool.query(`SELECT bidder_id FROM bidder WHERE wallet_id='${walletId}'`, (error, results) => {
        if (error) {
          throw error;
        }

        if (results.rows.length === 0) {
          pool.query(`INSERT INTO bidder (wallet_id, created_on) VALUES ('${walletId}', now()) RETURNING *`, (error, results) => {
            if (error) {
              throw error;
            }

            const bidderId = results.rows[0].bidder_id;
            pool.query(`INSERT INTO offer (auction_id, bidder_id, created_on, offer_value) VALUES (${req.params.auctionId}, ${bidderId}, now(), ${offerValue}) RETURNING *`,
              (error, results) => {
                if (error) {
                  throw error;
                }
                res.status(201).json(results.rows[0]);
              }
            );
          });
        } else {
          const bidderId = results.rows[0].bidder_id;
          pool.query(`INSERT INTO offer (auction_id, bidder_id, created_on, offer_value) VALUES (${req.params.auctionId}, ${bidderId}, now(), ${offerValue}) RETURNING *`,
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
});





// Graph (Futur project)


