$(document).ready(function() {
  loadUser();

  function loadUser() {
    $.getJSON('/userAtt', function(data) {
      if (data.hasOwnProperty('username')) {
        $('.name').html(data.username.name);
        $('.email').html(data.username.email);
        var user_id = data.username.id;
        AboutMe(user_id);
      }
    });
  }

  function AboutMe(user_id) {
    $.getJSON('/bios/' + user_id, function(bios) {
      var items = bios.about;
      if (items == 0) {
        noBio(items);
      } else {
        colPad(items);
      }   
    })
  }

  function noBio(items) {
    document.getElementById("bios").innerHTML +=
    '<div class="container">' +
      '<h3 style="color: white">' + "Its a Ghostown You Have No Bios" + '</h3>' +
    '</div>';
  }


  function colPad(items) {
    if (items.length == 1) {
      document.getElementById("bios").innerHTML +=
      '<div id="aboutThis" class="container mx-auto">' +
        '<div class="col-md-6 tilePadWide softTileBack col1Pad">' +
          '<h3 class="white regTitle cenX">' + items[0].title + '</h3>' +
          '<h5 class="tileDesc subPmin white">' + items[0].text + '</h5>' +
          '<a style="max-width: 300px" class="btn btn-outline-secondary btn-block mx-auto" href=/' + items[0].user_id + "/bio" + '>' + "Learn More" + '</a>' +
        '</div>' +
      '</div>';
        
      
    }
    if (items.length == 2) {
      document.getElementById("bios").innerHTML +=
      '<div class="row">' +
        '<div class="col-md-6 tilePadWide softTileBack col1Pad">' +
            '<h3 class="white regTitle cenX">' + items[0].title + '</h3>' +
            '<h5 class="tileDesc subPmin white">' + items[0].text + '</h5>' +
        '</div>' +
        '<div class="col-md-6 tilePadWide softTileBack col2Pad">' +
          '<h3 class="white regTitle cenX">' + items[1].title + '</h3>' +
          '<h5 class="tileDesc subPmin white">' + items[1].text + '</h5>' +
        '</div>' +
        '<a style="max-width: 300px" class="btn btn-outline-secondary btn-block mx-auto" href=/' + items[0].user_id + "/bio" + '>' + "Learn More" + '</a>' +
      '</div>';
    }
    if (items.length == 3) {
      document.getElementById("bios").innerHTML +=
      '<div class="row">' +
        '<div class="col-md-6 tilePadWide softTileBack col1Pad">' +
            '<h3 class="white regTitle cenX">' + items[0].title + '</h3>' +
            '<h5 class="tileDesc subPmin white">' + items[0].text + '</h5>' +
        '</div>' +
        '<div class="col-md-6 tilePadWide softTileBack col2Pad">' +
          '<h3 class="white regTitle cenX">' + items[1].title + '</h3>' +
          '<h5 class="tileDesc subPmin white">' + items[1].text + '</h5>' +
        '</div>' +
      '</div>' +
      '<div class="row">' +
        '<div class="col-md-6 tilePadWide softTileBack col1Pad">' +
          '<h3 class="white regTitle cenX">' + items[2].title + '</h3>' +
          '<h5 class="tileDesc subPmin white">' + items[2].text + '</h5>' +
        '</div>' +
      '</div>' +
      '<a style="max-width: 300px" class="btn btn-outline-secondary btn-block mx-auto" href=/' + items[0].user_id + "/bio" + '>' + "Learn More" + '</a>';
    }
    if (items.length == 4) {
      document.getElementById("bios").innerHTML +=
      '<div class="row">' +
        '<div class="col-md-6 tilePadWide softTileBack col1Pad">' +
          '<h3 class="white regTitle cenX">' + items[0].title + '</h3>' +
          '<h5 class="tileDesc subPmin white">' + items[0].text + '</h5>' +
        '</div>' +
        '<div class="col-md-6 tilePadWide softTileBack col2Pad">' +
          '<h3 class="white regTitle cenX">' + items[1].title + '</h3>' +
          '<h5 class="tileDesc subPmin white">' + items[1].text + '</h5>' +
        '</div>' +
      '</div>' +
      '<div class="row">' +
        '<div class="col-md-6 tilePadWide softTileBack col1Pad">' +
          '<h3 class="white regTitle cenX">' + items[2].title + '</h3>' +
          '<h5 class="tileDesc subPmin white">' + items[2].text + '</h5>' +
        '</div>' +
        '<div class="col-md-6 tilePadWide softTileBack col2Pad">' +
          '<h3 class="white regTitle cenX">' + items[3].title + '</h3>' +
          '<h5 class="tileDesc subPmin white">' + items[3].text + '</h5>' +
        '</div>' +
        '<a style="max-width: 300px" class="btn btn-outline-secondary btn-block mx-auto" href=/' + items[0].user_id + "/bio" + '>' + "Learn More" + '</a>' +
      '</div>';
    }
  }
});

$(document).ready(function() {
  loadTwitter();

  function loadTwitter() {
    $.getJSON('/twitterTimeline', function(data) {
      var tweets = data.twitter;

      if (tweets === 0) {
        nullTwitter();
      } else {
        var assets = data.twitter[0].user;
        twitterAssets(assets);
        tweets.forEach(getTweets);
      }
    });
  }

  function nullTwitter() {
    document.getElementById("profileAbout").innerHTML +=
    '<div style="color: white" class="container padY60 padX0">' +
        '<h5 stlye="color: white">' + "It Seems Like Your Twitter Account Isnt Linked" + '</h5>' +
          '<b style="color: white">' +
            "You can do it here " + '<a class="btn btn-info btn-lg" href="/auth/twitter">' + '<span class="fa fa-twitter fa-lg">' + '</span>' + '</a>' + '<br>' +
            "Or Visit " + '<a style="color: white" href="/account_setup">' + "Account Setup" + '</a>' +
          '</b>' +
    '</div>';

  }

  function twitterAssets(assets) {
    document.getElementById("profileAbout").innerHTML +=
    '<div style="color: white" class="container">' +
        '<img src=' + assets.profile_image_url + '>' + '<br>' +
            '<b>' + assets.name + '</b>' + '<br>' +
            '<b>' + "Following: " + assets.friends_count + '</b>' + '<br>' +
            '<b>' + "Followers: " + assets.followers_count + '</b>' + '<br>' +
            '<b>' + "Tweets: " + assets.statuses_count + '</b>' + '<br>' +
            '<b>' + "Likes: " + assets.favourites_count + '</b>' + '<br>' +
            '<b>' + "Location: " + assets.location + '</b>' + '<br>' +
            '<b>' + "Bio: " + assets.description + '</b>' + '<br>' +
    '</div>';
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
      if (data.git == 0) {
        nullGit()
      } else {
        gitAssets(data);
        data.forEach(getRepos)
      }
    });
  }

  function nullGit() {
    document.getElementById("gitAssets").innerHTML +=
    '<div style="color: white" class="container padY60 padX0">' +
        '<h5 stlye="color: white">' + "It Seems Like Your Github Account Isnt Linked" + '</h5>' +
          '<b style="color: white">' +
            "You can do it here " + '<a class="btn btn-success btn-lg" href="/auth/github">' + '<span class="fa fa-github fa-lg">' + '</span>' + '</a>' + '<br>' +
            "Or Visit " + '<a style="color: white" href="/account_setup">' + "Account Setup" + '</a>' +
          '</b>' +
    '</div>';
  }

  function gitAssets(data) {
    var user_url = "https://github.com/" + data[0].owner.login;
    $.getJSON('https://api.github.com/users/' + data[0].owner.login, function(asset) {
      document.getElementById("gitAssets").innerHTML +=
      '<div class="container">' +
          '<img class="circleImg" src=' + asset.avatar_url + '>' + '<br>' +
          '<b>' + '<a style="color: white" href=' + user_url + '>' + asset.name + '</a>' + '<br>' +
          '<b>' + 'Company: ' + asset.company + '</b>' + '<br>' +
          '<b>' + 'Blog: ' + asset.blog + '</b>' + '<br>' +
          '<b>' + 'Bio: ' + asset.bio + '</b>' + '<br>' +
          '<b>' + 'Public Repos Count: ' + '<strong class="odometer">' + asset.public_repos + '</strong>' + '</b>' + '<br>' +
          '<b>' + 'Following: ' + asset.following + ' Followers: ' + asset.followers + '</b>' + '<br>' +
          '<br>' + '<hr>' +
      '</div>';
    });
  }


  function getRepos(item, index) {
    document.getElementById("repos").innerHTML +=
      '<tr>' +
        '<td>' + item.name + ': ' + item.description + '</td>' +
        '<td>' + item.forks_count + '</td>' +
        '<td>' + item.language + '</td>' +
        '<td>' + item.watchers + '</td>' + 
        '<td>' + '<a style="float: right; overflow: none" class="btn btn-success btn-sm" href=' + item.html_url + '>'+ '<span class="fa fa-github">' + " url" + '</a>' + '</td>' +
      '</tr>';
  }

});

$(document).ready(function() {
  loadTwitch();


  function loadTwitch() {
    $.getJSON('/liveChannels', function(data) {
      if (data.live === 0) {
        nullChannels();
      } else {
        var arr = data.live.streams;
        arr.forEach(getStreams);
        Twitch();
      }
    });
  }

  function Twitch() {
    $.getJSON('/twitchUser', function(data) {
      if (data.twitch === 0) {
        nullChannels();
      } else {
        var asset = data.twitch
        document.getElementById("twitchProfile").innerHTML +=
        '<div class="container">' +
          '<img class="circleImg" src=' + asset.logo + '>' + '<br>' +
            '<b>' + "Twitch Name: " + '<a style="color: white" href=' + asset.url + '>' + asset.display_name + '</a>' + '</b>' + '<br>' +
            '<b>' + "Followers: " + asset.followers + '</b>' + '<br>' +
            '<b>' + "Views: " + asset.views + '</b>' + '<br>' +
            '<b>' + 
                "Last Seen Playing " + asset.game + '<br>' +
                "With Status " + asset.status + '</b>' + 
      '</div>';
      }
    });
  }


  function nullChannels() {
    document.getElementById("twitchProfile").innerHTML +=
    '<div style="color: white" class="container">' +
      '<h5 stlye="color: white">' + "It Seems Like Your Twitch Account Isnt Linked" + '</h5>' +
        '<b style="color: white">' +
          "You can do it here " + '<a class="btn twitchBtn btn-lg" href="/auth/twitch">' + '<span class="fa fa-twitch fa-lg">' + '</span>' + '</a>' + '<br>' +
          "Or Visit " + '<a style="color: white" href="/account_setup">' + "Account Setup" + '</a>' +
        '</b>' +
    '</div>';
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
