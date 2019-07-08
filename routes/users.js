var express = require('express');
var router = express.Router();
var User = require('../models/User'); 
var mongoose = require('mongoose');
var passport = require('../config/passport');
var auth = require('./auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

 router.route('/login')
   .post(function(req, res, next){
        var user = new User();

        if(!req.body.email){
          return res.status(422).json({errors: {email: "can't be blank"}});
        }

        if(!req.body.password){
          return res.status(422).json({errors: {password: "can't be blank"}});
        }
        passport.authenticate('local', {session: false}, function(err, user, info){
        if(err){ return next(err); }

        if(user){
          user.token = user.generateJWT();
          return res.json({'status': 'success','token': user.token});
        } else {
          return res.status(422).json(info);
        }
      })(req, res, next);
    });


  router.route('/signup').post(function(req, res, next){
    var user = new User();

    user.username = req.body.username.trim();
    user.email = req.body.email.trim();
    user.setPassword(req.body.password.trim());

    user.save().then(function(){
      return res.json({user: user.toAuthJSON()});
    }).catch(next);
  });

  router.get('/hello', function(req, res, next){
    res.send("hello");
  });

module.exports = router;
