$(document).ready(function() {
    loadGithub();
    

    function loadGithub() {
        $.getJSON('/sessionRepos', function(data) {
            data.forEach(repoContents)
        });
    }

    function repoContents(item, index) {
        $.getJSON('https://api.github.com/repos/' + item.owner.login + '/' + item.name + '/contents', function(content) {
            console.log(content);
        })
    }
})