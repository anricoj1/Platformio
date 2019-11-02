var configAuth = require('../auth.js');
var webpush = require('web-push');


module.exports = webpush.setVapidDetails(
  configAuth.webpush.mail,
  configAuth.webpush.publicVapidKey,
  configAuth.webpush.privateVapidKey
);
