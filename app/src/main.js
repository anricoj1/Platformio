// require sql connection
var requireRoot = '../../config/';
var connection = require(requireRoot + 'connect');

var uuidv3 = require('uuid');


// web-push
var webpush = require('web-push');
var vapidKeys = require(requireRoot + 'webpush/webpush');

// root Paths 
var rootPath = '../views/pages/';
var userRoot = '../views/pages/user/';
var accountRoot = '../views/pages/accounts/';

// continuation local storage (get response)
var cls = require('continuation-local-storage');

function getRes() {
    var namespace = cls.getNamespace('request');
    var response = namespace.get('res');
    return response;
}


// session Profile
exports.userProfile = function(session) {
    var res = getRes();
    connection.query("SELECT * FROM Posts WHERE user_name = ?",[session.name], function(err, rows) {
        if (rows.length) {
            res.render('../views/pages/profile.ejs', {user : session, posts : rows})
        } else {
            res.render('../views/pages/profile.ejs', {user : session, posts: 0});
        }
    });
}

// list parameter user profile
exports.findProfile = function(session, paramID) {
    var res = getRes();
    connection.query("SELECT * FROM User WHERE id = ?",[paramID], function(err, rows) {
        if (rows.length) {
            connection.query("SELECT following FROM Followers WHERE userID = ? AND paramID = ?",[session.id, paramID], function(err, result) {
                if (result.length) {
                    res.render(accountRoot + 'acc.ejs', {user : session, account : rows[0], follow : result[0]})
                } else {
                    res.render(accountRoot + 'acc.ejs', {user : session, account : rows[0], follow : 0})
                }
            });
        }
    });
}

// session notifications (web-push / service workers)
exports.userNotification = function(user, body) {
    var res = getRes();
    var subscription = body;
    connection.query("SELECT * FROM Followers WHERE paramID = ? AND following = 1",[user.id], function(err, rows) {
        if (rows.length) {
            var len = rows.length - 1;
            connection.query("SELECT name FROM User WHERE id = ?",[rows[len].userID], function(err, result) {
                var payload = JSON.stringify({
                    title : 'Notifications',
                    body : result[0].name + ' Followed You!'
                });
                webpush.sendNotification(subscription, payload).catch(err => console.log(err))
            })
        } else {
            var payload = JSON.stringify({
                title : 'Welcome! ' + user.name
            });
            webpush.sendNotification(subscription, payload).catch(err => console.log(err));
        }
    });
}


exports.addBio = function(user, body) {
    var res = getRes();
    var bio_id = uuidv3();

    if (!body) {
        alert("Must Fill Fields!")
        res.redirect('/add_bio')
    } else {
        connection.query("INSERT INTO Bio (bioID, title, text, user_id) VALUES (?,?,?,?)",[bio_id, body.title, body.bio, user.id], function(err, rows) {
            bio_id = rows.insertId;

            res.redirect('/profile')
        });
    }
}

exports.bioUrl = function(param) {
    var res = getRes();
    connection.query("SELECT * FROM Bio WHERE user_id = ?",[param], function(err, rows) {
        if (rows.length) {
            res.json({
                about : rows
            });
        } else {
            res.json({
                about : 0
            });
        }
    });
}


// follow  another user via stream
exports.followUser = function(user, paramID) {
    var res = getRes();
    connection.query("SELECT * FROM Followers WHERE userID = ? AND paramID = ?",[user.id, paramID], function(err, rows) {
        if (rows.length) {
            if (rows[0].following === 1) {
                connection.query("UPDATE Followers SET following = 0 WHERE paramID = ? AND userID = ?",[paramID, user.id], function(err, rows) {
                    res.redirect('/profile/' + paramID)
                });
            } else {
                connection.query("UPDATE Followers SET following = 1 WHERE paramID = ? AND userID = ?",[paramID, user.id], function(err, rows) {
                    res.redirect('/profile/' + paramID);
                });
            }
        } else {
            connection.query("INSERT INTO Followers (userID, paramID, following) VALUES (?,?,?)",[user.id, paramID, 1], function(err, rows) {
                res.redirect('/profile/' + paramID);
            });
        }
    });
}

// list session user followers
exports.sessionFollowers = function(user) {

}

// list session following
exports.sessionFollowing = function(user) {

}


// list parameter user following
exports.paramFollowing = function(oaramID) {

}


// list parameter user Follows
exports.paramFollowers = function(paramID) {
    var res = getRes();
    connection.query("SELECT * FROM Followers WHERE paramID = ? AND following = 1",[paramID], function(err, rows) {
        if (rows.length) {
            connection.query("SELECT name FROM User WHERE id = ?",[rows[0].userID], function(err, result) {
                res.json({
                    followers : result[0]
                });
            });
        } else {
            res.json({
                followers : 0
            });
        }
    });
}


// local login function
exports.localLogin = function(body, session) {
    var res = getRes();
    if (body.remember) {
        session.cookie.maxAge = 1000 * 60 * 3;
    } else {
        session.cookie.expires = false;
    }
    res.redirect('/');
}

// user Attributes
exports.userAtt = function(user) {
    var res = getRes();
    connection.query("SELECT * FROM User WHERE id = ?",[user.id], function(err, rows) {
        if (rows.length) {
          res.json({
            username: rows[0]
          });
        } else {
          res.json({
            username: 0
          });
        }
    });
}


exports.uploadAvi = function(user, file) {
    var res = getRes();
    connection.query("SELECT avi FROM User WHERE id = ?",[user.id], function(err, rows) {
        if (rows.length) {
            connection.query("UPDATE User SET banner = ? WHERE id = ?",[file.filename, user.id], function(err, rows) {
                res.send('Updated Header Photo!');
            });
        } else {
          res.send('There was an error. Try Again.');
        }
    });
}






