var requireRoot = '../../config/';
// require sql connection
var connection = require(requireRoot + 'connect');

// auth keys
var auth = require(requireRoot + 'auth');

// require api clients
var twitch = require('twitch-api-v5');
twitch.clientID = auth.twitchAuth.clientID;

var cls = require('continuation-local-storage');

function getRes() {
    var namespace = cls.getNamespace('request');
    var response = namespace.get('res');
    return response;
}

// session twitch timeline
exports.twitchTimeline = function(user) {
    var res = getRes();
    connection.query("SELECT * FROM Twitch WHERE user_id = ?",[user.id],function(err, rows) {
        if (rows.length) {
            twitch.channels.channelByID({ channelID : rows[0].twitchID}, (err, response) => {
                res.json({
                    twitch : response
                });
            })
        } else {
            res.json({
                twitchChannel : 0
            });
        }
    });
}

// session twitch Followers
exports.sessChannelFollowers = function(user) {
    var res = getRes();
    connection.query("SELECT * FROM Twitch WHERE user_id = ?",[user.id], function(err, rows) {
        if (rows.length) {
            twitch.channels.followers({ channelID: rows[0].twitchID}, (err, response) => {
                res.json({
                    twitchFollowers : response
                });
            });
        } else {
            res.json({
                twitchFollowers : 0
            });
        }
    });
}


exports.liveChannels = function(user) {
    var res = getRes();
    connection.query("SELECT * FROM Twitch WHERE user_id = ?",[user.id], function(err, rows) {
        if (rows.length) {
            twitch.streams.live({ userID : rows[0].twitchID}, (err, response) => {
                res.json({
                    live : response
                });
            });
        } else {
            twitch.streams.live({ userID : '1'}, (err, response) => {
                res.json({
                    streams : response
                });
            });
        }
    });
}


exports.channelVideos = function(user) {
    var res = getRes();
    connection.query("SELECT * FROM Twitch WHERE user_id = ?",[user.id], function(err, rows) {
        if (rows.length) {
            twitch.channels.videos({ channelID: rows[0].twitchID}, (err, response) => {
                res.json({
                    channelVideos : response
                });
            });
        } else {
            res.json({
                channelVideos : 0
            });
        }
    });
}

exports.searchChannels = function(user, body) {
    var res = getRes();
    twitch.search.channels({query : body.channels}, (err, response) => {
        res.render('../views/pages/twitch.ejs', {user : user, channel : response, body : body.channels})
    });
}


exports.searchGames = function(user) {
    var res = getRes();
    twitch.search.games({query : 'Call Of Duty'}, (err, response) => {
        console.log(response);
        res.json({
            searchGames : response
        });
    });
}