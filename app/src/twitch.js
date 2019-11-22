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
    connection.query("SELECT * FROM Twitch WHERE user_id = ?",[user.id], function(err, rows) {
        if (rows.length) {
            twitch.channels.channelByID({ channelID : rows[0].twitchID}, (err, response) => {
                res.json({
                    twitch : response
                });
            })
        } else {
            res.json({
                twitch : 0
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

// parameter twitch timeline function
exports.paramTwitchTimeline = function(param) {
    var res = getRes();
    connection.query("SELECT * FROM Twitch WHERE user_id = ?",[param], function(err, rows) {
        if (rows.length) {
            twitch.channels.channelByID({ channelID : rows[0].twitchID}, (err, response) => {
                res.json({
                    twitchChannel : response
                });
            });
        } else {
            res.json({
                twitchChannel : 0
            });
        }
    });
}

// live channels session function
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
            res.json({
                live : 0
            });
        }
    });
}

// paramete session function
exports.paramLiveChannels = function(param) {
    var res = getRes();
    connection.query("SELECT * FROM Twitch WHERE user_id = ?",[param], function(err, rows) {
        if (rows.length) {
            twitch.streams.live({ userID : rows[0].twitchID}, (err, response) => {
                res.json({
                    live : response
                });
            });
        } else {
            res.json({
                live : 0
            });
        }
    });
}

// channel videos (not used)
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

// search twitch (games, streams, channels)
exports.searchTwitch = function(user, body) {
    var res = getRes();
    if (body.selection === "Games") {
        twitch.search.games({ query : body.type}, (err, response) => {
            res.render('../views/pages/search_twitch.ejs', {user : user, search_query : response, body : body.type, select : body.selection})
        });
    } else if (body.selection === "Streams") {
        twitch.search.streams({ query : body.type}, (err, response) => {
            res.render('../views/pages/search_twitch.ejs', {user : user, search_query : response, body : body.type, select : body.selection})
        });
    } else {
        twitch.search.channels({query : body.type}, (err, response) => {
            res.render('../views/pages/search_twitch.ejs', {user : user, search_query : response, body : body.type, select : body.selection})
        });
    }
}

