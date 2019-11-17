$(document).ready(function() {
  loadUser();

  function loadUser() {
    $.getJSON('/userAtt', function(data) {
      if (data.hasOwnProperty('username')) {
        $('.name').html(data.username.name);
        $('.email').html(data.username.email);
        $('.id').html(data.username.id);
      }
    });
  }
});

$(document).ready(function() {
  loadTwitter();

  function loadTwitter() {
    $.getJSON('/twitterTimeline', function(data) {
      console.log(data);
      if (data.hasOwnProperty('twitter')) {
        $('.twitter_name').html(data.twitter[0].user.name);
        $('.screen_name').html(data.twitter[0].user.screen_name);
        $('.location').html(data.twitter[0].user.location);
        $('.description').html(data.twitter[0].user.description);
        $('.followers').html(data.twitter[0].user.followers_count);
        $('.following').html(data.twitter[0].user.friends_count);
        $('.created_at').html(data.twitter[0].user.created_at);
        $('.likes').html(data.twitter[0].user.favourites_count);
        $('.tweets').html(data.twitter[0].user.statuses_count);

        var tweets = data.twitter;
        tweets.forEach(getTweets);
        document.getElementById('twitterAvi').innerHTML += 
        '<img src=' + tweets[0].user.profile_image_url + '>';
      }
    });
  }

  function getTweets(item, index) {
    var url = 'https://twitter.com/' + item.user.screen_name;
    document.getElementById("tweets").innerHTML +=
    '<div class="media">' +
    '<img class="mr-3" src=' + item.user.profile_image_url + '>' +  
      '<div class="media-body">' + 
      '<h5 class="mt-0">' + item.user.name + '</h5>' +
      '<p>' + item.text + '<br>' + 
        "Tweeted At: " + item.created_at + '<br>' + 
        '<a class="btn btn-info btn-sm" href=' + url + '>' + "Profile" + '</a>' +
      '</p>' +
    '</div>' +
  '</div>' + '<hr>';
  }
});


$(document).ready(function() {
  loadGithub();

  function loadGithub() {
    $.getJSON('/sessionRepos', function(data) {
      console.log(data);
      data.forEach(getRepos);
      var gitUrl = 'https://github.com/' + data[0].owner.login; 
      document.getElementById("githubUser").innerHTML += 
      '<h4 style="color:#ffffff"><a href=' + gitUrl + '>' + "Git Username: " + data[0].owner.login + '</h4>';
    });
  }
  function getRepos(item, index) {
    document.getElementById("repos").innerHTML +=
    '<table class="table table-hover">' + 
      '<tr>' +
        '<th>' + item.name + ' ' + '|' + ' ' + item.description + '</th>' +
        '<th></th>' +
        '<th></th>' +
        '<th></th>' + 
      '</tr>' +
      '<tr>' +
        '<td>' + 'Forks: ' + item.forks_count + '</td>' +
        '<td>' + 'Watchers: ' + item.watchers + '</td>' +
        '<td>' + 'Language: ' + item.language + '</td>' +
        '<td>' + '<a style="float: right; overflow: none" class="btn btn-success btn-sm" href=' + item.html_url + '>'+ '<span class="fa fa-github">' + " url" + '</a>' + '</td>' +
      '</tr>' +
    '</table>'; 
  }
});

$(document).ready(function() {
  loadTwitch();


  function loadTwitch() {
    $.getJSON('/liveChannels', function(data) {
      console.log(data.live.streams);
      var arr = data.live.streams;
      arr.forEach(getStreams);
    });
  }

  
  function getStreams(item, index) {
    document.getElementById("streams").innerHTML +=
      '<div class="media">' +
        '<img class="mr-3" src=' + item.preview.small + '>' +  
          '<div class="media-body">' + 
          '<h5 class="mt-0">' + item.channel.display_name + " Is Streaming " + item.game + " To " + item.viewers + " Viewers With " + item.channel.followers + " Followers" + '</h5>' +
          '<p>' + "Description: " + item.channel.display_name + 
            " This Streamer Averages About " + item.average_fps + " fps." + '<br>' + 
            '<a class="btn btn-danger btn-sm" href=' + item.channel.url + '>' + "Live" + '</a>' +
          '</p>' +
        '</div>' +
      '</div>' + '<hr>';
  }
});