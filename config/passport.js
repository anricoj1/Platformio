var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var configAuth = require('./auth');

var mysql = require('mysql');
var bcrypt = require('bcrypt');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);


module.exports = function(passport) {


	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		connection.query("SELECT * FROM Users WHERE id = ?",[id], function(err, rows) {
			console.log(rows)
			done(err, rows[0]);
		});
	});


	passport.use('local-signup', new LocalStrategy({
		email : 'email',
		password : 'password',
		passReqToCallback : true
	},
	function(req, email, password, done) {
		connection.query("SELECT * FROM Users WHERE email = ?",[email], function(err, rows) {
			if (err)
				return done(err);
			if (rows.length) {
				return done(null, false, req.flash('signupMessage', 'Email in use.'));
			} else {
				var newUser = {
					email : email,
					password : bcrypt.hashSync(password, 10)
				};
				console.log(newUser)

				var insertQuery = "INSERT INTO Users (email, password) VALUES (?,?)";
				connection.query(insertQuery,[newUser.email, newUser.password],function(err, rows) {
					newUser.id = rows.insertId;

					return done(null, newUser);
				});
			}
		});
	}));

	passport.use('local-login', new LocalStrategy({
		email : 'email',
		password : 'password',
		passReqToCallback : true
	},
	function(req, email, password, done) {
		connection.query("SELECT * FROM Users WHERE email = ?",[email], function(err, rows) {
			if (err)
				return done(err);
			if (!rows.length) {
				return done(null, false, req.flash('loginMessage', 'No User Found'));
			}
			if (!bcrypt.compareSync(password, rows[0].password))
				return done(null, false, req.flash('loginMessage', 'Wrong Password!!'));

			return done(null, rows[0]);
		});
	}));




	passport.use(new GoogleStrategy({
	    clientID: configAuth.googleAuth.clientID,
	    clientSecret: configAuth.googleAuth.clientSecret,
	    callbackURL: configAuth.googleAuth.callbackURL
	  },
	  function(accessToken, refreshToken, profile, done) {
	    	process.nextTick(function(){
	    		User.findOne({'google.id': profile.id}, function(err, user){
	    			if(err)
	    				return done(err);
	    			if(user)
	    				return done(null, user);
	    			else {
	    				var newUser = new User();
	    				newUser.google.id = profile.id;
	    				newUser.google.token = accessToken;
	    				newUser.google.name = profile.displayName;
	    				newUser.google.email = profile.emails[0].value;

	    				newUser.save(function(err){
	    					if(err)
	    						throw err;
	    					return done(null, newUser);
	    				})
	    				console.log(profile);
	    			}
	    		});
	    	});
	    }

	));





};
