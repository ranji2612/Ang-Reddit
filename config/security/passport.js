// config/security/passport.js
'use strict';

//load strategy
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


//load the user model
var User			= require('../../app/models/userModel');

//exposing this function to the app
module.exports = function (passport) {
	
	// passport session setup  -  required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

	
	// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
		console.log(user.id);
		console.log(user);
		try {
        	done(null, user._id);
		} catch (err) {
			console.log(err);
		}
		
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
	
	//Local Signup Strategy
	passport.use('local-signup', new LocalStrategy({
			// by default, local strategy uses username and password, we will override with email
			usernameField : 'username',
			passwordField : 'password',
			passReqToCallback : true
		}, function(req, username, password, done) {
		// the above parameters ome as part of formdata
		
		console.log(req.body);
		process.nextTick(function () {
			
			//find a user with a same email as submitted during signup
			User.findOne({'local.email' : req.body.email}, function (err,user) {
				if (err)
					return done(err);
				//Checking for existing users with same email
				if (user) {
					return done(null, false, { message : 'Sorry..We have an existing account with that email..'});
				} else {
					//creating new user
					var newUser            = new User();
					
					//set the credentials
					newUser.local.email			= req.body.email;
					newUser.local.username		= username;
					// Prefer to hash it in client side
					newUser.local.password	= newUser.generateHash(password);
					//save the user
					newUser.save(function (err,newUser) {
						if (err)
							throw err;
						console.log('New User Created');
						return done(null, newUser);
					});
				}
			
			});
		
		});
	}));
	
	//Local-Signin Strategy
	passport.use('local-signin', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form
		console.log(req.user);
		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        User.findOne({ 'local.username' :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

			// if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));
};
												   