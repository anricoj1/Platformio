require('dotenv').config()
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mysql = require('mysql');
var mysqlStore = require('express-mysql-session')(session)
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');



// passport call
var request = require('request-promise');
var url = require('url');
var http = require('http');
var passport = require('passport');

var options = {
	host: process.env.DB_INSTANCE_NAME,
	user: process.env.DB_USER,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASS
}

var sessionStorage = new mysqlStore(options)


require('./config/passport')(passport);


app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());


app.use(session({
	secret: 's#cure',
	store : sessionStorage,
	saveUninitialized: false,
	resave: false,
	cookie: {
		secure: true,
		domain: 'csc400-246406.appspot.com',
		expires: false
	}
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
