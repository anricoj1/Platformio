var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var configAuth = require('./auth');

var mysql = require('mysql');
var bcrypt = require('bcrypt');
var uuidv3 = require('uuid')
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

module.exports = function(passport){

    passport.serializeUser(function(user, done){
        done(null, user.email);
    });

    passport.deserializeUser(function(email, done) {
      connection.query("SELECT * FROM User WHERE email = ?",[email], function(err, rows) {
        console.log(rows)
        done(err, rows[0])
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
          return done(null, false, req.flash('signupMessage', 'Email in use.'));
        } else {
          var newUser = {
            id : uuidv3(),
            token : uuidv3(),
            email : email,
            fullname : req.body.fullname,
            password : bcrypt.hashSync(password, 10)
          };
          console.log(newUser)

          var insertQuery = "INSERT INTO User (id, token, name, email, password) VALUES (?,?,?,?,?)";
          connection.query(insertQuery,[newUser.id,newUser.token,newUser.fullname,newUser.email,newUser.password],function(err, rows) {
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
            console.log(newUser)

            var insertGoogle = "INSERT INTO User (id, token, name, email, password) VALUES (?,?,?,?,?)";
            connection.query(insertGoogle,[newUser.id,newUser.token,newUser.name,newUser.email,newUser.password], function(err, rows) {
              newUser.id = rows.insertId;

              return done(null, newUser);
            });
          }
        });
      });
    }));
};
