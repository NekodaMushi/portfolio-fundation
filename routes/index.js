const { json } = require('express');
const express = require('express');
const router = express.Router();
const path = require('path');
require('dotenv').config();

const Pool = require('pg').Pool;

const config = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(config);
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/auction', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'auction.html'));
});

module.exports = router;

// TIMER

router.get('/api/auction/:auctionId/timer', function (req, res, next) {
  if (req.params.auctionId) {
    pool.query(
      `SELECT *, DATE_PART('epoch', sale_ends - NOW()) as time_left_seconds FROM auction WHERE auction_id=${req.params.auctionId}`,
      (error, results) => {
        if (error) {
          throw error;
        }

        const auctionData = results.rows[0];

        res.status(200).json(auctionData);
      }
    );
  }
});

// Base Information ---
router.get('/api/auction/:auctionId/details', function (req, res, next) {
  if (req.params.auctionId) {
    pool.query(
      `SELECT * FROM auction WHERE auction_id=${req.params.auctionId}`,
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).json(results.rows);
      }
    );
  }
});

// Highest bid & Floor Price

router.get('/api/auction/:auctionId/highOffer', function (req, res, next) {
  if (req.params.auctionId) {
    pool.query(
      `SELECT auction_id, max(offer_value) as max_offer_value FROM offer WHERE auction_id=${req.params.auctionId} GROUP BY auction_id`,
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).json(results.rows);
      }
    );
  }
});

router.get('/api/auction/:auctionId/lowOffer', function (req, res, next) {
  if (req.params.auctionId) {
    pool.query(
      `SELECT auction_id, MIN(offer_value) as min_offer_value FROM offer WHERE auction_id=${req.params.auctionId} AND bidder_id=1 GROUP BY auction_id`,
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).json(results.rows);
      }
    );
  }
});
// router.get('/api/wallet/:walletId', function (req, res) {
//   res.json({ currentBalance: 1000 });
// });

// -----------------------
// Highest bid && corresponding bidder for displaying winner

router.get('/api/auction/:auctionId/highestBidder', function (req, res, next) {
  pool.query(
    `SELECT wallet_id AS winner FROM bidder
                WHERE bidder_id = (
                  SELECT bidder_id
                  FROM offer
                  WHERE offer_value = (SELECT MAX(offer_value) FROM offer)
                )`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
});

// ---------------
// all offers according to auction_id
router.get('/api/auction/:auctionId/allOffers', function (req, res, next) {
  if (req.params.auctionId) {
    pool.query(
      `SELECT offer_value FROM offer WHERE auction_id=${req.params.auctionId} GROUP BY offer_value ORDER BY offer_value DESC`,
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).json(results.rows);
      }
    );
  }
});

// SELECT o.bidder_id, b.address
// FROM offer o
// JOIN bidder b ON o.bidder_id = b.id
// WHERE o.auction_id = <auction_id>;

// all bidders for that auction
router.get('/api/auction/:auctionId/allBidders', function (req, res, next) {
  if (req.params.auctionId) {
    pool.query(
      `SELECT b.wallet_id, b.bidder_id 
      FROM bidder b
      JOIN offer o on b.bidder_id = o.bidder_id
      WHERE auction_id=${req.params.auctionId}`,
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).json(results.rows);
      }
    );
  }
});

// bid creation timestamp
router.get('/api/auction/:auctionId/timestamp', function (req, res, next) {
  if (req.params.auctionId) {
    pool.query(
      `SELECT created_on FROM offer WHERE auction_id=${req.params.auctionId}`,
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).json(results.rows);
      }
    );
  }
});

// POST ------------------------ Need to optimize
router.post('/api/auction/:auctionId/offer', function (req, res) {
  const walletId = req.body.walletId;
  const offerValue = req.body.offerValue;

  // Sum of bid from this user
  pool.query(
    `SELECT SUM(offer_value) AS total_bids FROM offer o JOIN bidder b ON o.bidder_id = b.bidder_id WHERE b.wallet_id='${walletId}'`,
    (error, results) => {
      if (error) {
        throw error;
      }

      const totalBids = results.rows[0].total_bids || 0;
      let currentBalance;

      if (offerValue > currentBalance - totalBids) {
        res
          .status(400)
          .json({ error: 'Your bid exceeds your current wallet balance' });
      } else {
        pool.query(
          `SELECT bidder_id FROM bidder WHERE wallet_id='${walletId}'`,
          (error, results) => {
            if (error) {
              throw error;
            }

            if (results.rows.length === 0) {
              pool.query(
                `INSERT INTO bidder (wallet_id, created_on) VALUES ('${walletId}', now()) RETURNING *`,
                (error, results) => {
                  if (error) {
                    throw error;
                  }

                  const bidderId = results.rows[0].bidder_id;
                  pool.query(
                    `INSERT INTO offer (auction_id, bidder_id, created_on, offer_value) VALUES (${req.params.auctionId}, ${bidderId}, now(), ${offerValue}) RETURNING *`,
                    (error, results) => {
                      if (error) {
                        throw error;
                      }
                      res.status(201).json(results.rows[0]);
                    }
                  );
                }
              );
            } else {
              const bidderId = results.rows[0].bidder_id;
              pool.query(
                `INSERT INTO offer (auction_id, bidder_id, created_on, offer_value) VALUES (${req.params.auctionId}, ${bidderId}, now(), ${offerValue}) RETURNING *`,
                (error, results) => {
                  if (error) {
                    throw error;
                  }
                  res.status(201).json(results.rows[0]);
                }
              );
            }
          }
        );
      }
    }
  );
});
