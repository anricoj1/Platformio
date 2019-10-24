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
      }
    });
  }
});
