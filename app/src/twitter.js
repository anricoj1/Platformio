var requireRoot = '../../config/';
// require sql connection
var connection = require(requireRoot + 'connect');

// require api clients
var twitterClient = require(requireRoot + 'twitter/twitter');

var cls = require('continuation-local-storage');

function getRes() {
    var namespace = cls.getNamespace('request');
    var response = namespace.get('res');
    return response;
}

// session twitter Timeline
exports.twitterTimeline = function(user) {
    var res = getRes();
    connection.query("SELECT * FROM User u INNER JOIN Twitter t ON u.id=t.user_id WHERE email = ?",[user.email], function(err, rows) {
        if (rows.length) {
            var params = {screen_name : rows[0].screen_name};
            twitterClient.get('statuses/user_timeline', params, function(err, tweets, response) {
                res.json({
                    twitter : tweets
                });
            });
        } else {
          res.json({
            twitter : 0
          });
        }
    });
}

// parameter twitter Timeline
exports.twitterTimelineId = function(user) {
    var res = getRes();
    connection.query("SELECT * FROM User u INNER JOIN Twitter t ON u.id=t.user_id WHERE id = ?",[user.id], function(err, rows) {
        if (rows.length) {
            var params = {screen_name : rows[0].screen_name};
            twitterClient.get('statuses/user_timeline', params, function(err, tweets, response) {
                res.json({
                    twitter : tweets
                });
            });
        } else {
          res.json({
            twitter : 0
          });
        }
    });
}