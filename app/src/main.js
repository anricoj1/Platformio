// require sql connection
var requireRoot = '../../config/';
var connection = require(requireRoot + 'connect');

var uuidv3 = require('uuid');
var alert = require('alert-node');


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

// list parameter user attributes
exports.paramAttributes = function(param) {
    var res = getRes();
    connection.query("SELECT id, email, name, banner, avi FROM User WHERE id = ?",[param], function(err, rows) {
        if (rows.length) {
            res.json({
                param : rows
            });
        } else {
            res.json({
                param : 0
            })
        }
    })
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

// add a bio 
exports.addBio = function(user, body) {
    var res = getRes();
    var bio_id = uuidv3();

    if (!body.title && !body.bio) {
        alert("Must Fill Fields!")
        res.redirect('/add_bio');
    } else if (!body.title) {
        alert("Give This A Title!");
        res.redirect('/add_bio')
    } else if (!body.bio) {
        alert("Bios Must Have A Body!");
        res.redirect('/add_bio');
    } else {
        connection.query("INSERT INTO Bio (bioID, title, text, user_id) VALUES (?,?,?,?)",[bio_id, body.title, body.bio, user.id], function(err, rows) {
            bio_id = rows.insertId;

            res.redirect('/profile')
        });
    }
}

// json for bio on profile limit 4
exports.bioUrl = function(param) {
    var res = getRes();
    connection.query("SELECT * FROM Bio WHERE user_id = ? LIMIT 4",[param], function(err, rows) {
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

// session bio limit 4
exports.bioLimit = function(user) {
    var res = getRes();
    connection.query("SELECT * FROM Bio WHERE user_id = ? LIMIT 4",[user], function(err, rows) {
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


// extended bio view (show all)
exports.bioExtended = function(param) {
    var res = getRes();
    connection.query("SELECT * FROM Bio WHERE user_id = ? LIMIT 4",[param], function(err, rows) {
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


// callback hit if user is owner of bio
function isOwner(user, param, next) {
    connection.query("SELECT * FROM Bio WHERE bioID = ?",[param], function(err, rows) {
        if (rows.length) {
            if (rows[0].user_id === user.id) {
                next();
            } else {
                res.redirect('/profile');
            } 
        } else {
            res.send("404 Page Not Found")
        }
    });
}

// delete a bio
exports.deleteBio = function(user, param) {
    var res = getRes();
    if (isOwner) {
        connection.query("DELETE FROM Bio WHERE bioID = ?",[param], function(err, rows) {
            alert("Deleted Item From Bio!");
            res.redirect('/profile')
        });
    } else {
        alert("Woah! Not Authorized To Do That!")
        res.redirect('/profile');
    }
}


// follow  another user via stream
exports.followUser = function(user, paramID) {
    var res = getRes();
    connection.query("SELECT * FROM Followers WHERE userID = ? AND paramID = ?",[user.id, paramID], function(err, rows) {
        if (rows.length) {
            if (rows[0].following === 1) {
                connection.query("UPDATE Followers SET following = 0 WHERE paramID = ? AND userID = ?",[paramID, user.id], function(err, rows) {
                    alert("Unfollowed User");
                    res.redirect('/profile/' + paramID)
                });
            } else {
                connection.query("UPDATE Followers SET following = 1 WHERE paramID = ? AND userID = ?",[paramID, user.id], function(err, rows) {
                    alert("Followed User!");
                    res.redirect('/profile/' + paramID);
                });
            }
        } else {
            if (paramID === user.id) {
                alert("You Cannot Follow Yourself!");
                res.redirect('/profile/' + paramID);
            } else {
                alert("You Followed A User!");
                connection.query("INSERT INTO Followers (userID, paramID, following) VALUES (?,?,?)",[user.id, paramID, 1], function(err, rows) {
                    res.redirect('/profile/' + paramID);
                });
            }       
        }
    });
}

// list session user followers
exports.sessionFollowers = function(user) {
    var res = getRes();
    connection.query("SELECT * FROM Followers WHERE paramID = ? AND following = 1",[user.id], function(err, rows) {
        if (rows.length) {
            res.json({
                followers : rows
            })
        } else {
            res.json({
                followers : 0
            });
        }
    });

}

// list session following
exports.sessionFollowing = function(user) {
    var res = getRes();
    connection.query("SELECT * FROM Followers WHERE userID = ? AND following = 1",[user.id], function(err, rows) {
        if (rows.length) {
            res.json({
                following : rows
            })
        } else {
            res.json({
                following : 0
            });
        }
    });
}

// list parameter user Follows
exports.paramFollowers = function(param) {
    var res = getRes();
    connection.query("SELECT * FROM Followers WHERE paramID = ? AND following = 1",[param], function(err, rows) {
        if (rows.length) {
            res.json({
                followers : rows
            })
        } else {
            res.json({
                followers : 0
            });
        }
    });
}



// list parameter user following
exports.paramFollowing = function(param) {
    var res = getRes();
    connection.query("SELECT * FROM Followers WHERE userID = ? AND following = 1",[param], function(err, rows) {
        if (rows.length) {
            res.json({
                following : rows
            })
        } else {
            res.json({
                following : 0
            });
        }
    });
}

// all posts from this user
exports.getPosts = function(param) {
    var res = getRes();
    connection.query("SELECT * FROM Posts WHERE user_id = ?",[param], function(err, rows) {
        if (rows.length) {
            res.json({
                posts : rows
            })
        } else {
            res.json({
                posts : 0
            })
        }
    })
}


// limit one post (recent status)
exports.limitOne = function(user) {
    var res = getRes();
    connection.query("SELECT * FROM Posts WHERE user_id = ? LIMIT 1",[user], function(err, rows) {
        if (rows.length) {
            res.json({
                posts : rows
            })
        } else {
            res.json({
                posts : 0
            })
        }
    });
}


// all users on platformio
exports.allUsers = function() {
    var res = getRes();
    connection.query("SELECT * FROM User", function(err, rows) {
        res.json({
            users : rows
        });
    });
}

// add a post
exports.addPost = function(user, body) {
    var res = getRes();
    var post_id = uuidv3();
    if (!body.status) {
        alert("Oops! Fill Textbox First!");
        res.redirect('/profile');
    } else {
        connection.query("INSERT INTO Posts (postID, user_id, user_name, status, date_time) VALUES(?,?,?,?,?)",[post_id, user.id, user.name, body.status, Date(Date.now())], function(err, rows) {
            post_id = rows.insertId;
    
            alert("Status Sent!")
            res.redirect('/profile');
        });
    }
   
}

// delete post
exports.deletePost = function(user, param, next) {
    var res = getRes();
    if (postOwner) {
        connection.query("DELETE FROM Posts WHERE postID = ?",[param], function(err, rows) {
            if (err) {
                alert("There Was An Error. Try Again!")
            } else {
                alert("Post Deleted!");
                res.redirect("/profile")
            }
        });
    } else {
        alert("Unauthorized")
        res.redirect('/profile')
    }
    
}

// callback hit if user is owner of bio
function postOwner(user, param, next) {
    var res = getRes();
    connection.query("SELECT * FROM Posts WHERE postID = ?",[param], function(err, rows) {
        if (rows.length) {
            if (rows[0].user_id === user.id) {
                next();
            } else {
                alert("You Are Not The Owner!");
            } 
        } else {
            res.redirect('/profile');
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






