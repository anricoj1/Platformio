var requireRoot = '../../config/';

var connection = require(requireRoot + 'connect');
var youTube = require('youtube-node');

var youtube = new youTube();

youtube.setKey('AIzaSyBl-M5DeDu7LF5DZuNFHzp75aXoohnWEgM');

var cls = require('continuation-local-storage');


function getRes() {
    var namespace = cls.getNamespace('request');
    var response = namespace.get('res');
    return response;
}

exports.youtubeRelated = function() {
    youtube.search('Faze', 20, function(err, result) {
        console.log(JSON.stringify(result, null, 20));
    })
}



