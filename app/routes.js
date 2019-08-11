module.exports = function(app, passport){
	app.get('/', function(req, res){
		res.render('../views/pages/index.ejs', {user: req.user});
	});

	app.get('/login', function(req, res){
		res.render('../views/pages/user/login/login.ejs', { message: req.flash('loginMessage'), user: req.user});
	});
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}),
	function(req, res) {
		console.log("Welcome!");

		if (req.body.remember){
			req.session.cookie.maxAge = 1000 * 60 *3;
		} else {
			req.session.cookie.expires = false;
		}
		res.redirect('/');
	});

	app.get('/signup', function(req, res){
		res.render('../views/pages/user/login/register.ejs', { message: req.flash('signupMessage'), user: req.user });
	});


	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true
	}));


	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('../views/pages/user/profile/profile.ejs', {
			user : req.user
		});
	});

	app.get('/my_profile', function(req, res){
		res.render('../views/pages/index/index.ejs', {user: req.user});
	});

	app.get('/profile-google', isLoggedIn, function(req, res){
		res.render('profile.ejs', { user: req.user });
	});

	app.get('/contact', function(req, res){
		res.render('../views/pages/contact/contact.ejs')
	})


	app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { successRedirect: '/profile',
	                                      failureRedirect: '/' }));

	app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

	app.get('/auth/google/callback',
	  passport.authenticate('google', { successRedirect: '/profile',
	                                      failureRedirect: '/' }));


	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	})
};

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/login');
}
