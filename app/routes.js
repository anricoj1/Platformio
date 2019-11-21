module.exports = function(app, passport) {
  // require queries (return functions)
  var main = require('./src/main');
  var twitch = require('./src/twitch');
  var twitter = require('./src/twitter');
  var youtube = require('./src/youtube');
  var github = require('./src/github');

  // connection
  var connection = require('../config/connect');

  // init multer (photo upload)
  var multer = require('multer');

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

  //root path (render)
  var rootPath = '../views/pages/';
  var userRoot = '../views/pages/user/';
  
  // continuation local storage (request namespace)
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
    res.render(rootPath + 'index.ejs', {user : req.user})
  });
  
  app.get('/login', function(req, res) {
    res.render(userRoot + 'login/login.ejs', { message: req.flash('loginMessage'), user: req.user});
  });
  
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }),
  function(req, res) {
    return main.localLogin(req.body, req.session)
  });
  
  app.get('/signup', function(req, res) {
    res.render(userRoot + 'login/register.ejs', { message: req.flash('signupMessage'), user: req.user });
  });
  
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));
  
  app.get('/account_setup', isLoggedIn, function(req, res) {
    res.render(userRoot + 'profile/dash.ejs', {user : req.user});
  });

  app.get('/add_bio', isLoggedIn, function(req, res) {
    res.render(userRoot + 'profile/add_bio.ejs', {user : req.user})
  });

  app.post('/add_bio', isLoggedIn, function(req, res) {
    return main.addBio(req.user, req.body)
  });

  app.get('/bios/:id', isLoggedIn, function(req, res) {
    return main.bioUrl(req.params.id)
  })
  
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email']}));
  
  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect : '/profile',
    failureRedirect : '/'
  }));
  
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render(userRoot + 'profile/prof.ejs', {user: req.user});
  });
  
  app.get('/profile/:id', isLoggedIn, function(req, res) {
    return main.findProfile(req.user, req.params.id);
  });
  
  app.get('/auth/twitter', isLoggedIn, passport.authenticate('twitter'));
  
  app.get('/auth/twitter/callback', passport.authenticate('twitter'));

  app.get('/auth/twitch', isLoggedIn, passport.authenticate('twitch'));

  app.get('/auth/twitch/callback', isLoggedIn, passport.authenticate('twitch'));

  app.get('/auth/github', isLoggedIn, passport.authenticate('github'));

  app.get('/auth/github/callback', isLoggedIn, passport.authenticate('github'));

  app.get('/auth/youtube', isLoggedIn, passport.authenticate('youtube'));

  app.get('/auth/youtube/callback',isLoggedIn, passport.authenticate('youtube'));
  
  app.get('/userAtt', function(req, res) {
    return main.userAtt(req.user);
  });
  
  app.get('/twitterTimeline', isLoggedIn, function(req, res) {
    return twitter.twitterTimeline(req.user);
  });
  
  app.get('/twitterTimeline/:id', isLoggedIn, function(req, res) {
    return twitter.twitterTimelineId(req.params);
  });

  app.get('/twitter/:id', isLoggedIn, function(req, res) {
    res.render('../views/pages/twitter.ejs', {user : req.user});
  });

  app.get('/youtube', function(req, res) {
    return youtube.youtubeRelated();
  });

  app.get('/youtubeData', isLoggedIn, function(req, res) {
    return youtube.youtubeData(req.user);
  });

  app.get('/twitch/:id', isLoggedIn, function(req, res) {
    res.render('../views/pages/twitch.ejs', {user : req.user})
  });

  app.get('/twitchTimeline/:id', isLoggedIn, function(req, res) {
    return twitch.paramTwitchTimeline(req.params.id);
  });

  app.get('/twitchTimeline', isLoggedIn, function(req, res) {
    return twitch.twitchTimeline(req.user);
  });

  app.get('/twitchFollowers', isLoggedIn, function(req, res) {
    return twitch.sessChannelFollowers(req.user);
  });

  app.get('/liveChannels', function(req, res) {
    return twitch.liveChannels(req.user);
  })

  app.get('/twitchChannelVideos', isLoggedIn, function(req, res) {
    return twitch.channelVideos(req.user);
  });

  app.post('/searchChannels', isLoggedIn, function(req, res) {
    return twitch.searchChannels(req.user, req.body);
  });

  app.get('/searchGames', isLoggedIn, function(req, res) {
    return twitch.searchGames(req.user);
  });

  app.get('/sessionRepos', isLoggedIn, function(req, res) {
    return github.sessionRepos(req.user);
  });

  app.get('/repos/:id', isLoggedIn, function(req, res) {
    return github.paramRepos(req.params.id);
  });

  app.get('/github/:id', isLoggedIn, function(req, res) {
    res.render('../views/pages/github.ejs', {user : req.user});
  });

  app.get('/github/:user/:repo/events', isLoggedIn, function(req, res) {
    res.render('../views/pages/repoevents.ejs', {user : req.user, param : req.params})
  });

  app.get('/:user/:repo/events', isLoggedIn, function(req, res) {
    return github.repoEvents(req.params.user, req.params.repo);
  });

  app.get('/github/events', isLoggedIn, function(req, res) {
    return github.userEvents(req.user);
  });

  app.get('/git/events', isLoggedIn, function(req, res) {
    res.render('../views/pages/gitevents.ejs', {user : req.user})
  });
  
  app.get('/userFollowers/:id', isLoggedIn, function(req, res) {
    return main.paramFollowers(req.params.id);
  });
  
  app.post('/follow/:id', isLoggedIn, function(req, res) {
    return main.followUser(req.user, req.params.id);
  });
  
  app.post('/notifications', isLoggedIn, function(req, res) {
    return main.userNotification(req.user, req.body);
  });

  
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.post('/uploadHeader', isLoggedIn, upload.single('imgUploader'), function(req, res) {
    connection.query("SELECT banner FROM User WHERE id = ?",[req.user.id], function(err, rows) {
      if (rows.length) {
        if (!req.file) {
          res.send('Choose a Photo First!');
        } else {
          connection.query("UPDATE User SET banner = ? WHERE id = ?",[req.file.filename, req.user.id], function(err, rows) {
            res.send('Updated Header Photo!');
          });
        } 
      } else {
        res.redirect('/profile')
      }
    });
  });

  app.post('/uploadAvi', isLoggedIn, upload.single('aviUpload'), function(req, res) {
    return main.uploadAvi(req.user, req.file);
  });

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
}
