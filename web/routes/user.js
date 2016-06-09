var express = require('express');
var router = express.Router();
var $ = require("mongous").Mongous;
var cardtypes = require("../configs/cardtypes");

/* GET user profile */
router.get('/profile/:id', function(req, res, next) {
    $('coinbox.users').find({username:req.params.id},function (r) {
        var user = r.documents[0];
        $('coinbox.cards').find({user:user.username},function (r) {
            user.card = r.documents;
            user.card.forEach(function (c,i) {
                c.cardtype=cardtypes[c.cardtype].name;
            });
            res.render('index', { title: '硬币回收储值系统',user:  user,cardtypes:cardtypes});
        });
    });
});


/* GET user logout */
router.get('/logout',function(req, res, next) {
    res.cookie('user','null',{maxAge:0});
    res.redirect( '/' );
});

/* POST user login */
router.post('/login', function(req, res, next) {
    $('coinbox.users').find({username:req.body.username,password:req.body.password},function (r) {
        var user = r.documents[0];
        if(user){
            res.cookie('user',user.username,{ path:'/'});
            res.redirect( '/' );
        }else{
            res.send('Error!<a href="/">Back</a>');
        }
    });
});

/* POST user reg */
router.post('/reg', function(req, res, next) {
    var result=$('coinbox.users').save({
        username: req.body.username,
        password: req.body.password,
        realname: req.body.realname
    });
    if(result){
        res.cookie('user',req.body.username,{ path:'/'});
        res.redirect( '/' );
    }else{
        res.send('Error!<a href="/">Back</a>');
    }
});

/* GET user del */
router.get('/del/:id', function(req, res, next) {
    var result=$('coinbox.users').remove({
        username: req.params.id,
    });
    if(result){
        result=$('coinbox.cards').remove({
            user: req.params.id,
        });
        if(result){
            if(req.cookies.user===req.params.id){
                res.cookie('user','null',{maxAge:0});
            }
            res.send('Success!<a href="/">Back</a>');
        }else{
            res.send('Error!<a href="/">Back</a>');
        }
    }else{
        res.send('Error!<a href="/">Back</a>');
    }
});

module.exports = router;
