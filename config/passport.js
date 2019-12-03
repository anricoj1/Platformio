var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var twitterStrategy = require('passport-twitter').Strategy;
var twitchStrategy = require('passport-twitch-new').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var githubStrategy = require('passport-github').Strategy;
var youtubeStrategy =  require('passport-youtube-v3').Strategy;

var configAuth = require('./auth');
var bcrypt = require('bcrypt');
var uuidv3 = require('uuid')
var alert = require('alert-node');
var connection = require('./connect');

var back = ['blue.png', 'color.jpeg', 'mix.jpeg', 'pink.jpeg'];

var cls = require('continuation-local-storage');


function getUserNamespace() {
    var namespace = cls.getNamespace('request');
    var sessionUser = namespace.get('user');
    var response = namespace.get('res');
    return [sessionUser, response];
}

function random_item(back) {
  return back[Math.floor(Math.random()*back.length)];
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
          password : bcrypt.hashSync(password, 10),
          banner : random_item(back),
          avi : 'avi.png'
        };

        var insertQuery = "INSERT INTO User (id, token, name, email, password, banner, avi) VALUES (?,?,?,?,?,?,?)";
        connection.query(insertQuery,[newUser.id,newUser.token,newUser.fullname,newUser.email,newUser.password,newUser.banner,newUser.avi], function(err, rows) {
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
            password : profile.password,
            banner : random_item(back),
            avi : 'avi.png'
          };

          var insertGoogle = "INSERT INTO User (id, token, name, email, password, banner, avi) VALUES (?,?,?,?,?,?,?)";
          connection.query(insertGoogle,[newUser.id,newUser.token,newUser.name,newUser.email,newUser.password,newUser.banner,newUser.avi], function(err, rows) {
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
            alert("Response Found. This Account Is Already Linked!");
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
            twitterUser.user_id = rows.insertId;

            alert("Twitter Account Is Now Linked!");
            res.redirect('/profile');
          });
        }
      });
    });
  }));


  passport.use(new twitchStrategy({
    clientID: configAuth.twitchAuth.clientID,
    clientSecret: configAuth.twitchAuth.clientSecret,
    callbackURL: configAuth.twitchAuth.redirectURL,
    scope: "user_read"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      var nameSpaces = getUserNamespace();
      var session = nameSpaces[0];
      var res = nameSpaces[1];
      connection.query("SELECT * FROM Twitch WHERE twitchID = ?",[profile.id], function(err, rows) {
        if (err)
          return done(err);
        if (rows.length) {
          connection.query("SELECT * FROM User WHERE email = ?",[session.email], function(err, rows) {
            alert("Response Found. This Account Is Already Linked!");
            res.redirect('/profile');
          })
        } else {
          var twitchUser = {
            'user_id' : session.id,
            'twitchID' : profile.id,
            'display_name' : profile.display_name
          };

          var insertTwitch = "INSERT INTO Twitch (user_id, twitchID, display_name) VALUES(?,?,?)";
          connection.query(insertTwitch,[twitchUser.user_id, twitchUser.twitchID, twitchUser.display_name], function(err, rows) {
            twitchUser.user_id = rows.insertId;

            alert("Twitch Account Is Now Linked!");
            res.redirect('/profile');
          });
        }
      });
    });
  }));

  passport.use(new githubStrategy({
    clientID : configAuth.githubAuth.clientID,
    clientSecret : configAuth.githubAuth.clientSecret,
    callbackURL : configAuth.githubAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, cb) {
    process.nextTick(function() {
      var nameSpaces = getUserNamespace();
      var session = nameSpaces[0];
      var res = nameSpaces[1];
      connection.query("SELECT * FROM Github WHERE gitID = ?",[profile.id], function(err, rows) {
        if (rows.length) {
          connection.query("SELECT * FROM User WHERE id = ?",[session.id], function(err, rows) {
            alert("Response Found. This Account Is Already Linked!");
            res.redirect('/profile');
          })
        } else {
          var urls = [profile._json.followers_url, profile._json.following_url, profile._json.repos_url];
          var insertGit = "INSERT INTO Github (gitID, user_id, git_name, followersURL, followingURL, reposURL) VALUES(?,?,?,?,?,?)";

          connection.query(insertGit,[profile.id, session.id, profile.username, urls[0], urls[1], urls[2]], function(err, rows) {
            profile.id = rows.insertId;

            alert("Github Account Is Now Linked!")
            res.redirect('/profile');
          })
        }
      });
    });
  }));

  passport.use(new youtubeStrategy({
    clientID : configAuth.youtubeAuth.clientID,
    clientSecret : configAuth.youtubeAuth.clientSecret,
    callbackURL : configAuth.youtubeAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      var nameSpaces = getUserNamespace();
      var session = nameSpaces[0];
      var res = nameSpaces[1];
      connection.query("SELECT * FROM Youtube WHERE channelID = ?",[profile.id], function(err, rows) {
        if (rows.length) {
          connection.query("SELECT * FROM User WHERE id = ?",[session.id], function(err, rows) {
            res.redirect('/profile');
          });
        } else {
          var insertYoutube = "INSERT INTO Youtube (channelID, title, user_id) VALUES(?,?,?)";
          connection.query(insertYoutube,[profile.id, profile.displayName, session.id], function(err, rows) {
            profile.id = rows.insertId;

            res.redirect('/profile');
          });
        }
      });
    });
  }));

};
