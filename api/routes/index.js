const express = require('express');
const router = express.Router();
const path = require('path');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/auction', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'auction.html'));
});

// router.get('/auction', (req, res) => {
//   res.json('200', { title: 'fab' });


// })


module.exports = router;
