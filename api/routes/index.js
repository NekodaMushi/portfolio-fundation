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



// POST ------------------------ Need to optimize
router.post('/api/auction/:auctionId/offer', function (req, res) {
  if (req.body.walletId) {
    pool.query(`SELECT bidder_id FROM bidder WHERE wallet_id='${req.body.walletId}'`, (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rows.length === 0) {
        // ---

        pool.query(`INSERT INTO bidder (wallet_id, created_on) VALUES ('${req.body.walletId}', now())`, (error, results) => {
          if (error) {
            throw error;
          }
          res.status(201).json({ success: 'New wallet address' });
        });
        const newbidderId = results.rows[0].bidder_id;
        pool.query(`INSERT INTO offer (auction_id, bidder_id, created_on, offer_value) VALUES (${req.params.auctionId}, ${newbidderId}, now(), ${req.body.offerValue}) RETURNING *`, (error, results) => {
          if (error) {
            throw error;
          }
          res.status(201).json(results.rows[0]);
        });

      }
      else {
        const bidderId = results.rows[0].bidder_id;
        pool.query(`INSERT INTO offer (auction_id, bidder_id, created_on, offer_value) VALUES (${req.params.auctionId}, ${bidderId}, now(), ${req.body.offerValue}) RETURNING *`, (error, results) => {
          if (error) {
            throw error;
          }
          res.status(201).json(results.rows[0]);
        });
      }
    });
  }
});


// -----------------------


// Graph (Futur project)


