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
  var paramRoot = '../views/pages/accounts/';
  
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
  
  // adding bio
  app.get('/add_bio', isLoggedIn, function(req, res) {
    res.render(userRoot + 'profile/add_bio.ejs', {user : req.user})
  });
  

  app.post('/add_bio', isLoggedIn, function(req, res) {
    return main.addBio(req.user, req.body)
  });
  
  // get parameter biography
  app.get('/bios/:id', isLoggedIn, function(req, res) {
    return main.bioUrl(req.params.id)
  });

  // absolute url for parameter biography (render)
  app.get('/bio/:id', isLoggedIn, function(req, res) {
    res.render(paramRoot + 'acc_bio.ejs', {user : req.user})
  });
  
  // list all user biographies no set limit
  app.get('/bioextended/:id', isLoggedIn, function(req, res) {
    return main.bioExtended(req.params.id)
  });

  // url for session biographies (delete them here)
  app.get('/:id/bio', isLoggedIn, function(req, res) {
    res.render(userRoot + 'profile/bio.ejs', {user : req.user})
  });

  // delete a bio post
  app.post('/deleteBio/:id', isLoggedIn, function(req, res) {
    return main.deleteBio(req.user, req.params.id)
  });

  // login with google (actually serializes user)
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email']}));
  
  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect : '/profile',
    failureRedirect : '/'
  }));
  
  // link these !! (not serializing a user)
  app.get('/auth/twitter', isLoggedIn, passport.authenticate('twitter'));
  
  app.get('/auth/twitter/callback', passport.authenticate('twitter'));

  app.get('/auth/twitch', isLoggedIn, passport.authenticate('twitch'));

  app.get('/auth/twitch/callback', isLoggedIn, passport.authenticate('twitch'));

  app.get('/auth/github', isLoggedIn, passport.authenticate('github'));

  app.get('/auth/github/callback', isLoggedIn, passport.authenticate('github'));

  
  // session profile
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render(userRoot + 'profile/prof.ejs', {user: req.user});
  });
  
  // parameter profile
  app.get('/profile/:id', isLoggedIn, function(req, res) {
    return main.findProfile(req.user, req.params.id);
  });

  // session user attributes (json)
  app.get('/userAtt', function(req, res) {
    return main.userAtt(req.user);
  });

  // parameter user attributes (json)
  app.get('/userAtt/:id', function(req, res) {
    return main.paramAttributes(req.params.id)
  });
  
  // session twitter timeline (statuses / data)
  app.get('/twitterTimeline', isLoggedIn, function(req, res) {
    return twitter.twitterTimeline(req.user);
  });
  
  // parameter of previous
  app.get('/twitterTimeline/:id', isLoggedIn, function(req, res) {
    return twitter.twitterTimelineId(req.params);
  });

  // full twitter view
  app.get('/twitter/:id', isLoggedIn, function(req, res) {
    res.render('../views/pages/twitter.ejs', {user : req.user});
  });
  
  // full twitch view
  app.get('/twitch/:id', isLoggedIn, function(req, res) {
    res.render('../views/pages/twitch.ejs', {user : req.user})
  });

  // parameter twitch timeline (data)
  app.get('/twitchTimeline/:id', isLoggedIn, function(req, res) {
    return twitch.paramTwitchTimeline(req.params.id);
  });

  // session twitch timeline (data)
  app.get('/twitchUser', isLoggedIn, function(req, res) {
    return twitch.twitchTimeline(req.user);
  });


  // live channels relates to session
  app.get('/liveChannels', isLoggedIn, function(req, res) {
    return twitch.liveChannels(req.user);
  });

  // live channels relates to parameter
  app.get('/liveChannels/:id', isLoggedIn, function(req, res) {
    return twitch.paramLiveChannels(req.params.id);
  });


  // search twitch channels
  app.post('/searchChannels', isLoggedIn, function(req, res) {
    return twitch.searchTwitch(req.user, req.body);
  });

  // search twitch games
  app.get('/searchGames', isLoggedIn, function(req, res) {
    return twitch.searchTwitch(req.user);
  });
  
  // session github repositories
  app.get('/sessionRepos', isLoggedIn, function(req, res) {
    return github.sessionRepos(req.user);
  });
  
  // parameter github repositories
  app.get('/repos/:id', isLoggedIn, function(req, res) {
    return github.paramRepos(req.params.id);
  });

  // users full github view
  app.get('/github/:id', isLoggedIn, function(req, res) {
    res.render('../views/pages/github.ejs', {user : req.user});
  });
  
  // repository events (render)
  app.get('/github/:user/:repo/events', isLoggedIn, function(req, res) {
    res.render('../views/pages/repoevents.ejs', {user : req.user, param : req.params})
  });
  
  // events of a repository (json)
  app.get('/:user/:repo/events', isLoggedIn, function(req, res) {
    return github.repoEvents(req.params.user, req.params.repo);
  });
  
  // users github recent events (all)
  app.get('/events/:id', isLoggedIn, function(req, res) {
    return github.userEvents(req.params.id);
  });

  // render for previous
  app.get('/:id/events', isLoggedIn, function(req, res) {
    res.render('../views/pages/gitevents.ejs', {user : req.user})
  });
  
  // get parameter followers
  app.get('/followers/:id', isLoggedIn, function(req, res) {
    return main.paramFollowers(req.params.id);
  });

  app.get('/following/:id', isLoggedIn, function(req,res) {
    return main.paramFollowing(req.params.id)
  });

  app.get('/following', isLoggedIn, function(req, res) {
    return main.sessionFollowing(req.user)
  });

  app.get('/followers', isLoggedIn, function(req, res) {
    return main.sessionFollowers(req.user)
  });

  app.get('/friends', isLoggedIn, function(req, res) {
    res.render('../views/pages/friends.ejs', {user : req.user})
  });

  app.get('/friends/:id', isLoggedIn, function(req, res) {
    res.render('../views/pages/acc_friends.ejs', {user : req.user})
  });

  app.get('/posts/:id', isLoggedIn, function(req, res) {
    return main.getPosts(req.params.id)
  });

  app.get('/user_list', isLoggedIn, function(req, res) {
    return main.allUsers();
  });


  app.get('/users_all', isLoggedIn, function(req, res) {
    res.render('../views/pages/users.ejs', {user : req.user})
  });
  
  // follow a user
  app.post('/follow/:id', isLoggedIn, function(req, res) {
    return main.followUser(req.user, req.params.id);
  });

  // webpush service worker notification
  app.post('/notifications', isLoggedIn, function(req, res) {
    return main.userNotification(req.user, req.body);
  });

  app.post('/sendStatus', isLoggedIn, function(req, res) {
    return main.addPost(req.user, req.body);
  });

  app.post('/delete_post/:id', isLoggedIn, function(req, res, next) {
    return main.deletePost(req.user, req.params.id, next)
  });

  app.get('/timeline', isLoggedIn, function(req, res) {
    res.render('../views/pages/feed.ejs', {user : req.user})
  });


  app.get('/recentStatus/:id', isLoggedIn, function(req, res) {
    return main.limitOne(req.params.id)
  });

  app.get('/userposts/:id', isLoggedIn, function(req, res) {
    res.render('../views/pages/userposts.ejs', {user : req.user})
  });

  app.get('/myposts', isLoggedIn, function(req, res) {
    res.render('../views/pages/myposts.ejs', {user : req.user})
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // upload header photo ajax submission (multer)
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

  app.get('/documentation', function(req, res) {
    res.render('../views/pages/docs.ejs', {user : req.user})
  });

  app.get('/getting_started', function(req, res) {
    res.render('../views/pages/getstarted.ejs', {user : req.user})
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
