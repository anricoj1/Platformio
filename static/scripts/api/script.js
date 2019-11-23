var url = window.location.pathname;
var filename = (url.substring(9, url.length));
var new_url = '/twitterTimeline/' + filename
var friends_url = '/friends/' + filename; 

$(document).ready(function() {
  loadFollows()
  loadFollowing()

  function loadFollows() {
    $.getJSON('/followers/' + filename, function(data) {
      if (data.followers == 0) {
        zeroFollowers();
      } else {
        followerCount(data);
      }
    });
  }

  function loadFollowing() {
    $.getJSON('/following/' + filename, function(data) {
      if (data.following == 0) {
        zeroFollowing();
      } else {
        followingCount(data);
      }
    });
  }

  function followerCount(data) {
    document.getElementById("followers").innerHTML +=
    '<p style="color: white">' + '<a style="color: white" href=' + friends_url + '>' + "Followers: " + '</a>' + '<b class="odometer">' + data.followers.length + '</b>' + '</p>';
  }

  function zeroFollowers() {
    document.getElementById("followers").innerHTML +=
    '<p style="color: white">' + '<a style="color: white" href=' + friends_url + '>' + "Followers: 0" + '</a>' + '</p>';
  }
  
  function zeroFollowing() {
    document.getElementById("following").innerHTML +=
    '<p style="color: white">' + '<a style="color: white" href=' + friends_url + '>' + "Following: 0" + '</a>' + '</p>';
  }
  
  function followingCount(data) {
    document.getElementById("following").innerHTML +=
    '<p style="color: white">' + '<a style="color: white" href=' + friends_url + '>' + "Following: " + '</a>' + '<b class="odometer">' + data.following.length + '</b>' + '</p>';
  }

});

$(document).ready(function() {
  loadUser();
  
  
  function loadUser() {
    $.getJSON('/userAtt/' + filename, function(data) {
      AboutMe(data);
      userPosts(data);
    });
  }

  function userPosts(data) {
    $.getJSON('/posts/' + data.param[0].id, function(data) {
      if (data.posts == 0) {
        noPosts();
      } else {
        for (var i = 0; i < data.posts.length; i++) {
          document.getElementById("myposts").innerHTML +=
          '<div class="media">' +
          '<span class="mr-3 fa fa-user fa-lg">' + '</span>' +  
            '<div class="media-body">' + 
              '<h5 class="mt-0">' + data.posts[i].user_name + '</h5>' +
                '<p style="color: black">' + 
                    data.posts[i].status + '<br>' + 
                    data.posts[i].date_time +
                '</p>' +
            '</div>' +
        '</div>' + '<hr>';
        }
      }
    });
  }

  function noPosts() {
    document.getElementById("myposts").innerHTML +=
    '<p>' + "No Posts Shared Yet" + '</p>';
  }


  function AboutMe(data) {
    $.getJSON('/bios/' + data.param[0].id, function(bios) {
      console.log(bios);
      var items = bios.about;
      if (items == 0) {
        noBio(items);
      } else {
        colPad(items);
      }   
    });
  }

  function noBio(items) {
    document.getElementById("bios").innerHTML +=
    '<div class="container">' +
      '<h3>' + "Its a Ghostown This User Has No Bios" + '</h3>' +
    '</div>';
  }

  function colPad(items) {
    if (items.length == 1) {
      document.getElementById("bios").innerHTML +=
      '<div id="aboutThis" class="container mx-auto">' +
        '<div class="col-md-6 tilePadWide softTileBack col1Pad">' +
          '<h3 class="white regTitle cenX">' + items[0].title + '</h3>' +
          '<h5 class="tileDesc subPmin white">' + items[0].text + '</h5>' +
          '<a style="max-width: 300px" class="btn btn-outline-secondary btn-block mx-auto" href=/bio/' + items[0].user_id + '>' + "Learn More" + '</a>' +
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
        '<a style="max-width: 300px" class="btn btn-outline-secondary btn-block mx-auto" href=/bio/' + items[0].user_id + '>' + "Learn More" + '</a>' +
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
      '<a style="max-width: 300px" class="btn btn-outline-secondary btn-block mx-auto" href=/bio/' + items[0].user_id + '>' + "Learn More" + '</a>';
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
        '<a style="max-width: 300px" class="btn btn-outline-secondary btn-block mx-auto" href=/bio/' + items[0].user_id + '>' + "Learn More" + '</a>' +
      '</div>';
    }
  }
  
});
