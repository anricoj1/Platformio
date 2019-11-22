var url = window.location.pathname;
var filename = (url.substring(9, url.length));
var new_url = '/twitterTimeline/' + filename

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

$(document).ready(function() {
  loadUser();
  
  
  function loadUser() {
    $.getJSON('/userAtt/' + filename, function(data) {
      var user_id = data.param[0].id;
      AboutMe(user_id);
    })
  }

  function AboutMe(user_id) {
    $.getJSON('/bios/' + user_id, function(bios) {
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
