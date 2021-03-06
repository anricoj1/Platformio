var requireRoot = '../../config/';
var connection = require(requireRoot + 'connect');
var fetch = require('node-fetch');

var cls = require('continuation-local-storage');

function getRes() {
    var namespace = cls.getNamespace('request');
    var response = namespace.get('res');
    return response;
}

// session github repositories must be async
exports.sessionRepos = async function(user) {
    var res = getRes();
    connection.query("SELECT user_id, reposURL FROM Github WHERE user_id = ?",[user.id], function(err, rows) {
        if (rows.length) {
            fetch(rows[0].reposURL)
            .then(res => res.json())
            .then(json => res.json(json))
            .catch(err => console.log(err));
        } else {
            res.json({
                git : 0
            });
        }
    });
}

// parameter repositories must be async
exports.paramRepos = async function(param) {
    var res = getRes();
    connection.query("SELECT user_id, reposURL FROM Github WHERE user_id = ?",[param], function(err, rows) {
        if (rows.length) {
            fetch(rows[0].reposURL)
            .then(res => res.json())
            .then(json => res.json(json))
            .catch(err => console.log(err));
        } else {
            res.json({
                git : 0
            });
        }
    });
}

// repo events (any)
exports.repoEvents = async function(user, repo) {
    var res = getRes();
    var url = "https://api.github.com/repos/" + user + "/" + repo + "/events";
    fetch(url)
    .then(res => res.json())
    .then(json => res.json(json))
    .catch(err => console.log(err))
}

// user events (github any) pertains to session
exports.userEvents = async function(param) {
    var res = getRes();
    connection.query("SELECT user_id, git_name FROM Github WHERE user_id = ?",[param], function(err, rows) {
        if (rows.length) {
            fetch("https://api.github.com/users/" + rows[0].git_name + '/events')
            .then(res => res.json())
            .then(json => res.json(json))
            .catch(err => console.log(err))
        } else {
            res.json({
                git_events : 0
            });
        }
    });
}