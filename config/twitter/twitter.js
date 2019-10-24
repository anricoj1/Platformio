var twitter = require('twitter');
var configAuth = require('../auth.js')
var twitterClient = new twitter({
  consumer_key: configAuth.twitterAuth.consumer_key,
  consumer_secret: configAuth.twitterAuth.consumer_secret,
  access_token_key: configAuth.twitterAuth.access_token_key,
  access_token_secret: configAuth.twitterAuth.access_token_secret
});

module.exports = twitterClient;
