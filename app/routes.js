module.exports = function(app, passport) {
    var connection = require('../config/connect');
    var twitterClient = require('../config/twitter/twitter');

    const { createNamespace } = require('continuation-local-storage');
    const User = createNamespace('request');

    app.use((req, res, next) => {
        User.run(() => next())
      });

      app.use((req, res, next) => {
        User.set('user', req.user);
        User.set('res', res);
        next()
      });

    app.get('/', function(req, res) {
        res.render('../views/pages/index.ejs', {user : req.user})
    });

    app.get('/login', function(req, res) {
      res.render('../views/pages/user/login/login.ejs', { message: req.flash('loginMessage'), user: req.user});
    });

    app.post('/login', passport.authenticate('local-login', {
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: true
    }),
    function(req, res) {
      console.log("Welcome!");

      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 *3;
      } else {
        req.session.cookie.expires = false;
      }
      res.redirect('/');
    });

    app.get('/signup', function(req, res) {
      res.render('../views/pages/user/login/register.ejs', { message: req.flash('signupMessage'), user: req.user });
    });

    app.post('/signup', passport.authenticate('local-signup', {
      successRedirect: '/profile',
      failureRedirect: '/signup',
      failureFlash: true
    }));

    app.get('/account_setup', function(req, res) {
        res.render('../views/pages/setup.ejs')
    });

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email']}));

    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('../views/pages/user/profile/profile.ejs', {user: req.user})
    });

    app.get('/auth/twitter', isLoggedIn, passport.authenticate('twitter'));

    app.get('/auth/twitter/callback', passport.authenticate('twitter'));

    app.get('/userAtt', function(req, res) {
        connection.query("SELECT * FROM User u INNER JOIN Twitter t ON u.id=t.user_id WHERE email = ?",[req.user.email], function(err, rows) {
            var queryUser = {
                'id' : rows[0].id,
                'email' : rows[0].email,
                'name' : rows[0].name,
            }
            res.json({
              username: queryUser
            });
        });
    });

    app.get('/twitterTimeline', function(req, res) {
      connection.query("SELECT * FROM User u INNER JOIN Twitter t ON u.id=t.user_id WHERE email = ?",[req.user.email], function(err, rows) {
        var params = rows[0].screen_name;

        twitterClient.get('statuses/user_timeline', params, function(err, tweets, response) {
          res.json({
            twitter : tweets
          });
        });
      });
    });

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
}
