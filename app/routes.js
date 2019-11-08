module.exports = function(app, passport) {
    var connection = require('../config/connect');
    var twitterClient = require('../config/twitter/twitter');
    var multer = require('multer');
    var uuidv3 = require('uuid');

    var webpush = require('web-push');
    var vapidKeys = require('../config/webpush/webpush');

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
        res.render('../views/pages/user/profile/dash.ejs', {user : req.user});
    });

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email']}));

    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
      res.render('../views/pages/user/profile/prof.ejs', {user: req.user})
    });

    app.post('/pusherTest', function(req, res) {
      var post_id = uuidv3();
      connection.query("INSERT INTO Posts (postID, user_id, user_name, status, date_time) VALUES(?,?,?,?,?)",[post_id,req.user.id,req.user.name,req.body.status,Date(Date.now())], function(err, rows) {
        post_id = rows.insertId;
        channels_client.trigger('my-channel', 'my-event', {
          status: req.body.status
        });

        res.json({ success: true, message: 'Post Sent!'})
      });
    });


    app.get('/profile/:id', isLoggedIn, function(req, res) {
      connection.query("SELECT * FROM User u INNER JOIN Twitter t ON u.id=t.user_id WHERE id = ?",[req.params.id], function(err, rows) {
        if (err)
          return err;
        if (rows.length) {
          connection.query("SELECT following FROM Followers WHERE userID = ? and paramID = ?",[req.user.id, req.params.id], function(err, result) {
            if (result.length) {
              res.render('../views/pages/accounts/acc.ejs', {user : req.user, account : rows[0], follow : result[0]})
            } else {
              res.render('../views/pages/accounts/acc.ejs', {user : req.user, account : rows[0], follow : 0})
            }
          });
        }
      });
    });

    app.get('/auth/twitter', isLoggedIn, passport.authenticate('twitter'));

    app.get('/auth/twitter/callback', passport.authenticate('twitter'));


    app.get('/userAtt', function(req, res) {
      connection.query("SELECT * FROM User WHERE email = ?",[req.user.email], function(err, rows) {
        if (rows.length) {
          res.json({
            username: rows[0]
          });
        } else {
          res.json({
            username: null
          });
        }
      });
    });


    app.get('/twitterTimeline', isLoggedIn, function(req, res) {
      connection.query("SELECT * FROM User u INNER JOIN Twitter t ON u.id=t.user_id WHERE email = ?",[req.user.email], function(err, rows) {
        if (err)
          return err;
        if (rows.length) {
          var params = {screen_name : rows[0].screen_name};
          twitterClient.get('statuses/user_timeline', params, function(err, tweets, response) {
            res.json({
              twitter : tweets
            });
          });
        } else {
          res.json({
            twitter : null
          });
        }
      });
    });

    app.get('/twitterTimeline/:id', isLoggedIn, function(req, res) {
      connection.query("SELECT * FROM User u INNER JOIN Twitter t ON u.id=t.user_id WHERE id = ?",[req.params.id], function(err, rows) {
        if (err)
          return err;
        if (rows.length) {
          var params = {screen_name : rows[0].screen_name};
          twitterClient.get('statuses/user_timeline', params, function(err, tweets, response) {
            res.json({
              twitter : tweets
            });
          });
        } else {
          res.json({
            twitter : null
          });
        }
      });
    });

    app.get('/userFollowers/:id', function(req, res) {
      connection.query("SELECT * FROM Followers WHERE paramID = ? AND following = 1",[req.params.id], function(err, rows) {
        if (err)
          return err;
        if (rows.length) {
          connection.query("SELECT name FROM User WHERE id = ?",[rows[0].userID], function(err, result) {
            res.json({
              followers : result[0]
            })
          })
        } else {
          res.json({
            followers : 0
          });
        }
      });
    });

    app.post('/follow/:id', function(req, res) {
      connection.query("SELECT following, userID, paramID FROM Followers WHERE userID = ? AND paramID = ?",[req.user.id, req.params.id], function(err, rows) {
        if (rows.length) {
          if (rows[0].following === 1) {
            connection.query("UPDATE Followers SET following = 0 WHERE paramID = ? AND userID = ?",[req.params.id, req.user.id], function(err, rows) {
              res.redirect('/profile/' + req.params.id)
            });
          } else if (rows[0].following === 0) {
            connection.query("UPDATE Followers SET following = 1 WHERE paramID = ? AND userID = ?",[req.params.id, req.user.id], function(err, rows) {
              res.redirect('/profile/' + req.params.id)
            });
          }
        } else {
          connection.query("INSERT INTO Followers (following, userID, paramID) VALUES (?,?,?)",[1, req.user.id, req.params.id], function(err, rows) {
            req.user.id = rows.insertId;
            res.redirect('/profile/' + req.params.id)
          });
        }
      });
    });


    app.post('/notifications', function(req, res) {
      var subscription = req.body
      connection.query("SELECT * FROM Followers f INNER JOIN User u ON u.id=f.userID WHERE userID = ? AND following = 1",[req.user.id], function(err, rows) {
        if (rows.length) {
          var payload = JSON.stringify({
            title : 'Notifications!',
            body : rows[0].name + ' Followed You!'
          });
          webpush.sendNotification(subscription, payload).catch(err => console.log(err))
        } else {
          var payload = JSON.stringify({
            title : 'Welcome! ' + req.user.name
          });
          webpush.sendNotification(subscription, payload).catch(err => console.log(err));
        }
      });
    });

    var storage = multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, './static/public')
      },
      filename: function(req, file, cb) {
        cb(null, file.fieldname + req.user.id + '.png');
      }
    });

    var upload = multer({
      storage: storage
    });

    app.post('/uploadHeader', upload.single('imgUploader'), function(req, res) {
      connection.query("SELECT banner FROM User WHERE id = ?",[req.user.id], function(err, rows) {
        if (rows.length) {
          connection.query("UPDATE User SET banner = ? WHERE id = ?",[req.file.filename, req.user.id], function(err, rows) {
            res.send('Updated Header Photo!')
          });
        } else {
          res.send('There was an error. Try Again.');
        }
      });
    });

    app.get('/uploadAvi', upload.single(''), function(req, res) {
      connection.query("SELECT avi FROM User WHERE id = ?",[req.user.id], function(err, rows) {
        if (rows.length) {
          connection.query("UPDATE User SET banner = ? WHERE id = ?",[req.file.filename, req.user.id], function(err, rows) {
            res.send('Updated Header Photo!');
          });
        } else {
          res.send('There was an error. Try Again.');
        }
      });
    });

    app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });


};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
}
