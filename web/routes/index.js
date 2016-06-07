var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '硬币回收储值系统' });
});

/* GET admin page. */
router.get('/admin', function(req, res, next) {
  res.render('admin', { title: '硬币回收储值系统' });
});

module.exports = router;
