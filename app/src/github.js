var requireRoot = '../../config/';
var connection = require(requireRoot + 'connect');
var fetch = require('node-fetch');

var cls = require('continuation-local-storage');

function getRes() {
    var namespace = cls.getNamespace('request');
    var response = namespace.get('res');
    return response;
}


exports.sessionRepos = async function(user) {
    var res = getRes();
    connection.query("SELECT user_id, reposURL FROM Github WHERE user_id = ?",[user.id], function(err, rows) {
        fetch(rows[0].reposURL)
        .then(res => res.json())
        .then(json => res.json(json))
    });
}