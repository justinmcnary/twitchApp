const apiKEY = 'pdp56o0lme1di0rehahlqbaykx2v90';
let offline = [];
let online = [];
let state = [];
let searchName = '';
let searchResult = [];
let searchResultOffline = [];
let userArray = [
  'ESL_SC2',
  'OgamingSC2',
  'cretetion',
  'freecodecamp',
  'storbeck',
  'habathcx',
  'RobotCaleb',
  'noobs2ninjas'
];

//display top 25 live streams
let twitchTime = () => {
  $.ajax({
    url: ' https://api.twitch.tv/kraken/streams/featured',
    headers: {
      'Client-ID': `${apiKEY}`
    },
    data: {
      // limit: 25
    },
    success: data => {
      state = [];
      let length = data.featured.length;
      let element = data.featured;
      for (var i = 0; i < length; i++) {
        state.push({
          name: element[i].stream.channel.name,
          logo: element[i].stream.channel.logo,
          game: element[i].stream.channel.game,
          text: element[i].text,
          link: element[i].stream.channel.url
        });
      }
      showUsers();
    }
  });
};

//get user
let twitchUser = () => {
  offline = [];
  online = [];
  userArray.forEach(val => {
    $.ajax({
      url: ` https://api.twitch.tv/kraken/streams/${val}`,
      headers: {
        'Client-ID': `${apiKEY}`
      },
      success: data => {
        if (data.stream !== null) {
          online.push(data);
        } else if (data.stream === null) {
          $.ajax({
            url: `https://api.twitch.tv/kraken/users/${val}`,
            headers: {
              'Client-ID': `${apiKEY}`
            },
            success: data => {
              offline.push(data);
            }
          });
        }
      }
    });
  });
};

//search for user
let searchForUser = () => {
  searchResult = [];
  searchResultOffline = [];
  $.ajax({
    url: ` https://api.twitch.tv/kraken/streams/${searchName}`,
    headers: {
      'Client-ID': `${apiKEY}`
    },
    success: data => {
      if (data.stream !== null) {
        searchResult.push(data);
        showSearchResultsOnline();
      } else if (data.stream === null) {
        $.ajax({
          url: `https://api.twitch.tv/kraken/users/${searchName}`,
          headers: {
            'Client-ID': `${apiKEY}`
          },
          success: data => {
            searchResultOffline.push(data);
            showSearchResultsOffline();
          }
        });
      }
    }
  });
};

//error function
const displayError = () => {
  $('#logo').prepend(`
  <div class="container">
    <h1>USER NOT FOUND PLEASE TRY AGAIN.</h1>
  </div>`);
};

//render to DOM
let showUsers = () => {
  state.forEach(val => {
    $('#logo').prepend(`
    <div class='row align-items-start'>
    <div class="col-md-3 image-col">
      <img class="profile-image" src=${val.logo}>
    </div>
    <div class="col-md-9">
      <h3>${val.name}</h3>
      <h4>${val.game} <a target='_blank' href='${val.link}'>Live Feed</a></h4>
      ${val.text}
    </div>
    </div>`);
  });
};

const showOffline = val => {
  if (val.bio == null) {
    val.bio = 'Super sweet.';
  }
  if (val.logo == null) {
    val.logo = 'http://68.media.tumblr.com/bc7c918db6b7b50377dea52c27e865b4/tumblr_inline_n9tbr4Hu6p1qgp297.png';
  }
  $('#logo').prepend(`
    <div class='row align-items-start'>
    <div class="col-md-3 image-col">
      <img class="profile-image" src=${val.logo}>
    </div>
    <div class="col-md-9">
      <h3>${val.name}</h3>
      ${val.bio}
      <img class="game-on" src="http://sdtimes.com/wp-content/uploads/2014/10/goneoffline.png">
    </div>
    </div>`);
};

const showOnline = val => {
  $('#logo').prepend(`
    <div class='row align-items-start'>
    <div class="col-md-3 image-col">
      <img class="profile-image" src=${val.stream.channel.logo}>
    </div>
    <div class="col-md-9">
      <h3>${val.stream.channel.name}</h3>
      <h6>${val.stream.game}</h6>
      ${val.stream.channel.status}
      <img class="game-on" src="https://pbs.twimg.com/profile_images/769263729666060290/dEWknTTh.jpg">
    </div>
    </div>`);
};

//show friends online
let showFriendsOnline = () => {
  online.forEach(val => {
    showOnline(val);
  });
};

//show friends offline
let showFriendsOffline = () => {
  offline.forEach(val => {
    showOffline(val);
  });
};

//show search results
let showSearchResultsOffline = () => {
  searchResultOffline.forEach(val => {
    showOffline(val);
  });
};

let showSearchResultsOnline = () => {
  searchResult.forEach(val => {
    showOnline(val);
  });
};

//click handlers
//search
$('#basic-addon2').on('click', function() {
  $('#logo').html(`<div></div>`);
  searchName = $('.search-term').val();
  searchForUser();
  $('.search-term').val('');
});

//search enter press
$(document).keypress(function(e) {
  var keycode = e.keyCode ? e.keyCode : e.which;
  if (keycode == '13') {
    $('#logo').html(`<div></div>`);
    searchName = $('.search-term').val();
    searchForUser();
  }
});

//top25 button
$('#top-25').on('click', function() {
  $('#logo').html(`<div></div>`);
  twitchTime();
});

//show online users
$('#users').on('click', function() {
  $('#logo').html(`<div></div>`);
  showFriendsOnline();
});

//show users offline
$('#offline').on('click', function() {
  $('#logo').html(`<div></div>`);
  showFriendsOffline();
});

//show all friends
$('#all-friends').on('click', function() {
  $('#logo').html(`<div></div>`);
  showFriendsOnline();
  showFriendsOffline();
});

// AJAX error handling
$(document).ajaxError(function(event, jqxhr, settings, thrownError) {
  displayError();
});

twitchTime();
twitchUser();
