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

// Display Winner *** FINAL

router.get('/api/auction/:auctionId/highestBidder', function (req, res, next) {
  pool.query(
    `SELECT wallet_id AS topBidder FROM bidder
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
      console.log('Here the ONE WE WANT', results.rows);

      res.status(200).json(results.rows);
    }
  );
});

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

// --------------------- HERE

router.get(
  '/api/auction/:walletAddress/totalBidPerWallet',
  function (req, res) {
    const walletAddress = req.params.walletAddress;
    pool.query(
      `SELECT o.offer_id, max(o.offer_value) as highest_bid, o.auction_id
    FROM offer o 
    JOIN bidder b ON o.bidder_id = b.bidder_id 
    WHERE b.wallet_id='${walletAddress}' 
    GROUP BY o.offer_id, o.auction_id
    ORDER BY o.offer_value DESC
    `,
      (error, results1) => {
        if (error) {
          throw error;
        }
        console.log('first result is: ', results1.rows);

        pool.query(
          `SELECT o.offer_id, o.auction_id
      FROM offer o 
      JOIN (
          SELECT auction_id, MAX(offer_value) AS highest_bid
          FROM offer
          GROUP BY auction_id
      ) t ON o.auction_id = t.auction_id AND o.offer_value = t.highest_bid
      ORDER BY o.auction_id ASC`,
          (error, results2) => {
            if (error) {
              throw error;
            }
            console.log('second result is: ', results2.rows);
            const refundBalanceArr = [];
            const expanseBalanceArr = [];

            for (const row1 of results1.rows) {
              const row2 = results2.rows.find(
                row => row.offer_id === row1.offer_id
              );
              if (!row2) {
                refundBalanceArr.push({
                  auction_id: row1.auction_id,
                  highest_bid: row1.highest_bid,
                });
              } else {
                expanseBalanceArr.push({
                  auction_id: row1.auction_id,
                  highest_bid: row1.highest_bid,
                });
              }
            }

            const totalRefund = refundBalanceArr.reduce(
              (acc, cur) => acc + cur.highest_bid,
              0
            );

            const totalExpense = expanseBalanceArr.reduce(
              (acc, cur) => acc + cur.highest_bid,
              0
            );
            console.log('totalExpense: ', typeof totalExpense);

            res.status(200).json({
              userGetBalanceBack: totalRefund,
              userExpense: totalExpense,
            });
          }
        );
      }
    );
  }
);

// POST ----
router.post('/api/auction/:auctionId/offer', function (req, res) {
  const walletId = req.body.walletId;
  const offerValue = req.body.offerValue;
  const currentBalance = req.body.currentBalance;

  // Sum of bid from this user---------
  pool.query(
    `SELECT max(offer_value) as highest_bid,auction_id
    FROM offer o JOIN bidder b ON o.bidder_id = b.bidder_id 
    WHERE b.wallet_id='${walletId}' group by auction_id`,
    (error, results) => {
      if (error) {
        throw error;
      }

      const totalBids =
        results.rows.reduce((partialSum, a) => partialSum + a.highest_bid, 0) ||
        0;
      let balanceAuction = currentBalance - totalBids;
      let total = totalBids;

      if (offerValue > balanceAuction) {
        res
          .status(200)
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
                  total += offerValue;

                  let finalResponse = results.rows[0];
                  finalResponse.totalBid = total;
                  res.status(201).json(finalResponse);
                }
              );
            }
          }
        );
      }
    }
  );
});
