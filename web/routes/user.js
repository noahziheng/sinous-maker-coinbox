var express = require('express');
var router = express.Router();

/* GET user profile */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET user reg */
router.get('/reg', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST user reg */
router.post('/reg', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
