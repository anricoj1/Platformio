require('dotenv').config()
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');



// passport call
var request = require('request-promise');
var url = require('url');
var http = require('http');
var passport = require('passport');


require('./config/passport')(passport);

// session storage
var mysqlStore = require('express-mysql-session')(session);
var sessionStorage = new mysqlStore({
	host : process.env.DB_HOST,
	user : process.env.DB_USER,
	password : process.env.DB_PASS,
	database : process.env.DB_DATABASE
});


app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());


app.use(session({
	secret : 's#cure',
	store : sessionStorage,
	saveUninitialized : true,
	resave : true
}));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/views/pages'));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



require('./app/routes.js')(app, passport);

app.listen(port);
console.log('Server running on http://localhost:8080');
