var url = window.location.pathname;
var filename = (url.substring(9, url.length));
var new_url = '/twitterTimeline/' + filename
$(document).ready(function() {
    loadTwitter();

    function loadTwitter() {
        $.getJSON(new_url, function(data) {
            if (data.hasOwnProperty('twitter')) {
                console.log(data);
                $('.twitter_name').html(data.twitter[0].user.name);
                $('.screen_name').html(data.twitter[0].user.screen_name);
                $('.location').html(data.twitter[0].user.location);
                $('.description').html(data.twitter[0].user.description);
                $('.followers').html(data.twitter[0].user.followers_count);
                $('.following').html(data.twitter[0].user.friends_count);
                $('.created_at').html(data.twitter[0].user.created_at);
                $('.likes').html(data.twitter[0].user.favourites_count);
                $('.tweets').html(data.twitter[0].user.statuses_count);
            }
        });
    }
});

$(document).ready(function() {
  loadFollows();

  function loadFollows() {
    $.getJSON('/userFollowers/' + filename, function(data) {
      if (data.hasOwnProperty('followers')) {
        $('.fCount').html(countFollowers(data));

        function countFollowers(data) {
          var arr = [];
          if (data.followers.name) {
            arr.push(data.followers.name)
            return arr.length;
          } else {
            var arrlen = 0;
            return arrlen;
          }
        }
      }
    })
  }
});
