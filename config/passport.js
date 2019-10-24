var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var twitterStrategy = require('passport-twitter').Strategy;
var twitchStrategy = require('passport-twitch-new').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;

var configAuth = require('./auth');
var bcrypt = require('bcrypt');
var uuidv3 = require('uuid')
var connection = require('./connect');

var cls = require('continuation-local-storage');


function getUserNamespace() {
    var namespace = cls.getNamespace('request');
    var sessionUser = namespace.get('user');
    var response = namespace.get('res');
    return [sessionUser, response];
}


module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.email);
    });

    passport.deserializeUser(function(email, done) {
        connection.query("SELECT * FROM User WHERE email = ?",[email], function(err, rows) {
            done(err, rows[0]);
        });
    });

    passport.use('local-signup', new LocalStrategy({
      email : 'email',
      fullname : 'fullname',
      password : 'password',
      passReqToCallback : true
    },
    function(req, email, password, done) {
      connection.query("SELECT * FROM User WHERE email = ?",[email], function(err, rows) {
        if (err)
          return done(err);
        if (rows.length) {
          return done(null, false. req.flash('signupMessage', 'Email in use.'));
        } else {
          var newUser = {
            id : uuidv3(),
            token : uuidv3(),
            email : email,
            fullname : req.body.fullname,
            password : bcrypt.hashSync(password, 10)
          };

          var insertQuery = "INSERT INTO User (id, token, name, email, password) VALUES (?,?,?,?,?)";
          connection.query(insertQuery,[newUser.id,newUser.token,newUser.fullname,newUser.email,newUser.password], function(err, rows) {
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
      connection.query("SELECT * FROM User WHERE email = ?",[email], function(err, rows) {
        if (err)
          return done(err);
        if (!rows.length) {
          return done(null, false, req.flash('loginMessage', 'No User Found'));
        }
        if (!bcrypt.compareSync(password, rows[0].password))
          return done(null, false, req.flash('loginMessage', 'Wrong Password!'));

        return done(null, rows[0]);
      });
    }));

    passport.use(new GoogleStrategy({
        clientID : configAuth.googleAuth.clientID,
        clientSecret : configAuth.googleAuth.clientSecret,
        callbackURL : configAuth.googleAuth.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            connection.query("SELECT * FROM User WHERE email = ?",[profile.emails[0].value], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    connection.query("SELECT * FROM User WHERE email = ?",[profile.emails[0].value], function(err, rows) {
                        return done(null, rows[0])
                    })
                } else {
                    var newUser = {
                        id : profile.id,
                        token : accessToken,
                        name : profile.displayName,
                        email : profile.emails[0].value,
                        password : profile.password
                    };

                    var insertGoogle = "INSERT INTO User (id, token, name, email, password) VALUES (?,?,?,?,?)";

                    connection.query(insertGoogle,[newUser.id,newUser.token,newUser.name,newUser.email,newUser.password], function(err, rows) {
                        newUser.id = rows.insertId;

                        return done(null, newUser);
                    });

                }
            });
        });
    }));

    passport.use(new twitterStrategy({
        consumerKey: configAuth.twitterAuth.consumer_key,
        consumerSecret: configAuth.twitterAuth.consumer_secret,
        callbackURL: configAuth.twitterAuth.callbackURL
    },
    function(token, tokenSecret, profile, done) {
        process.nextTick(function() {
          var nameSpaces = getUserNamespace();
          var session = nameSpaces[0];
          var res = nameSpaces[1];
          connection.query("SELECT * FROM Twitter WHERE twitterID = ?",[profile.id], function(err, rows) {
            if (err)
              return done(err);
            if (rows.length) {
              connection.query("SELECT * FROM User WHERE email = ?",[session.email], function(err, rows) {
                res.redirect('/profile');
              });
            } else {
              var twitterUser = {
                'user_id' : session.id,
                'twitterID' : profile.id,
                'screen_name' : profile.username
              };

              var insertTwitter = "INSERT INTO Twitter (user_id, twitterID, screen_name) VALUES(?,?,?)";
              connection.query(insertTwitter,[twitterUser.user_id,twitterUser.twitterID,twitterUser.screen_name], function(err, rows) {
                twitterUser.id = rows.insertId;

                res.redirect('/profile');
              });
            }
          });
        });
      }));

};
