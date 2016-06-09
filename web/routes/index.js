var express = require('express');
var router = express.Router();
var $ = require("mongous").Mongous;
var cardtypes = require("../configs/cardtypes");

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.cookies.user) {
        $('coinbox.users').find({username:req.cookies.user},function (r) {
            var user = r.documents[0];
            $('coinbox.cards').find({user:user.username},function (r) {
                user.card = r.documents;
                user.card.forEach(function (c,i) {
                    c.cardtype=cardtypes[c.cardtype].name;
                });
                res.render('index', { title: '硬币回收储值系统',user:  user,cardtypes:cardtypes});
            });
        });
    }else{
        var user=false;
        res.render('index', { title: '硬币回收储值系统',user:  user});
    }
});

/* GET admin page. */
router.get('/admin', function(req, res, next) {
    $('coinbox.users').find({},function (r) {
        var users = r.documents;
        $('coinbox.cards').find({},function (r) {
            cards = r.documents;
            cards.forEach(function (c,i) {
                c.cardtype=cardtypes[c.cardtype].name;
            });
            res.render('admin', { title: '硬币回收储值系统',users:  users,cards:cards});
        });
    });
});

module.exports = router;
