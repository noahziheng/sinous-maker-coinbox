var express = require('express');
var router = express.Router();
var $ = require("mongous").Mongous;
var cardtypes = require("../configs/cardtypes");

/* GET card profile */
router.get('/profile/:id', function(req, res, next) {
    $('coinbox.cards').find({cardid:req.params.id},function (r) {
        var card = r.documents[0];
        card.cardtype=cardtypes[card.cardtype].name;
        $('coinbox.logs').find({cardid:req.params.id},function (r) {
            var logs = r.documents;
            res.render('card', { title: '硬币回收储值系统',card:  card,cardtypes:cardtypes,logs:logs});
        });
    });
});

/* POST add card */
router.post('/add', function(req, res, next) {
    var result = $('coinbox.cards').save({
        cardtype:req.body.cardtype,
        cardno:parseInt(req.body.cardno),
        cardid:req.body.cardid.toUpperCase(),
        cardval:parseFloat(req.body.cardval),
        user:req.cookies.user
    });
    $('coinbox.logs').save({
        cardid:req.body.cardid,
        type:"初始化",
        val:parseFloat(req.body.cardval),
        rval:parseFloat(req.body.cardval),
        client:"Web",
        time:require('dateformat')(new Date(),"isoDateTime")
    });
    if(result){
        res.send('Success!<a href="/">Back</a>');
    }else{
        res.send('Error!<a href="/">Back</a>');
    }
});

/* POST set card */
router.post('/set/:id', function(req, res, next) {
    var result = $('coinbox.cards').update({cardid:req.params.id},{
        cardtype:req.body.cardtype,
        cardno:parseInt(req.body.cardno),
        cardid:req.body.cardid.toUpperCase(),
        cardval:parseFloat(req.body.cardval),
        user:req.body.user
    });
    if(result){
        res.send('Success!<a href="/">Back</a>');
    }else{
        res.send('Error!<a href="/">Back</a>');
    }
});


/* POST pay card */
router.post('/pay/:id', function(req, res, next) {
    $('coinbox.cards').find({cardid:req.params.id},function (r) {
        r = r.documents[0];
        if(req.body.inval){
            var rval = r.cardval + parseFloat(req.body.inval);
            var type = "充值";
        }else if(req.body.outval){
            var rval = r.cardval - parseFloat(req.body.outval);
            var type = "支付";
        }else{
            var rval = r.cardval;
            var type = "空操作";
        }
        $('coinbox.logs').save({
            cardid:r.cardid,
            type:type,
            val:rval-r.cardval,
            rval:rval,
            client:"Web",
            time:require('dateformat')(new Date(),"isoDateTime")
        });
        result = $('coinbox.cards').update({cardid:req.params.id},{
            cardtype:r.cardtype,
            cardno:r.cardno,
            cardid:r.cardid,
            cardval:rval,
            user:r.user
        });
        if(result){
            res.send('Success!<a href="/">Back</a>');
        }else{
            res.send('Error!<a href="/">Back</a>');
        }
    });
});

/* GET del card */
router.get('/del/:id', function(req, res, next) {
    var result=$('coinbox.logs').remove({
        cardid: req.params.id,
    });
    result=$('coinbox.cards').remove({
        cardid: req.params.id,
    });
    if(result){
        res.send('Success!<a href="/">Back</a>');
    }else{
        res.send('Error!<a href="/">Back</a>');
    }
});

module.exports = router;
