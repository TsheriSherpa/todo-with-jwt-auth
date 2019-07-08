var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');


passport.serializeUser(function(user, done) {
  done(null, user.id);
});


passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


passport.use(new LocalStrategy({
	usernameField : 'email',
	passwordField : 'password',
},
	function(username, password, done) {
    
  		User.findOne({email: username.trim()},function(err,user){
        if(err){
          return res.send(err);
        }
    		if(!user) {
            console.log(user);
      			return done(null, false, {errors: 'email is invalid'});
    		}
        if( !user.validPassword(password)){
          return done(null, false, {errors: 'Password is invalid'});
        }
	    	return done(null, user);
    	}).catch(done);
	}
));

module.exports = passport;