/* app.js*/

const express = require('express');
const app = express();
const path = require("path");
const fs = require('fs');

// external requests
const request = require('request-promise');
const url = require('url');
const querystring = require('querystring');
const http = require('http');


// jsdom
const jsdom = require("jsdom");
const {JSDOM} = jsdom;


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));
app.set('trust proxy', true);

const hostname= 'localhost'

app.listen(8080, hostname, function() {
  console.log('Server running at http://'+ hostname + ':' + 8080 + '/');
})



app.get('/', (req, res) => {
  let purl = url.parse(req.url, true);
  let pathname = 'pages' + purl.pathname;

  if ((pathname)[pathname.length - 1] === '/') {
    pathname += 'index';
  }
  res.render(pathname, purl.query);
});


app.get('/index', (req, res) => {
  res.render('../views/pages/index.ejs')
})
