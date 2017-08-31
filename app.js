const apiKEY = 'pdp56o0lme1di0rehahlqbaykx2v90';
const secret = 'hh8fg5s1t7ei58ity6e83zw7x93v6u';
let offline = [];
let online = [];
let state = [];
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
      // console.log(data);
      let length = data.featured.length;
      let element = data.featured;
      for (var i = 0; i < length; i++) {
        state.push({
          name: element[i].stream.channel.name,
          logo: element[i].stream.channel.logo,
          game: element[i].stream.channel.game,
          text: element[i].text
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
      <h6>${val.game}</h6>
      ${val.text}
    </div>
    </div>`);
  });
};

//show friends online
let showFriendsOnline = () => {
  online.forEach(val => {
    $('#logo').prepend(`
    <div class='row align-items-start'>
    <div class="col-md-3 image-col">
      <img class="profile-image" src=${val.stream.channel.logo}>
    </div>
    <div class="col-md-8">
      <h3>${val.stream.channel.name}</h3>
      <h6>${val.stream.game}</h6>
      ${val.stream.channel.status}
    </div>
    <div class="col-md-1">
      <img class="game-on" src="https://pbs.twimg.com/profile_images/769263729666060290/dEWknTTh.jpg">
    </div>
    </div>`);
  });
};

//show friends offline
let showFriendsOffline = () => {
  offline.forEach(val => {
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
    <div class="col-md-8">
      <h3>${val.name}</h3>
      ${val.bio}
    </div>
    <div class="col-md-1">
      <img class="game-on" src="http://img4.wikia.nocookie.net/__cb8/offgame/images/5/50/Wiki-background">
    </div>
    </div>`);
  });
};

//click handlers
//search
$('#basic-addon2').on('click', function() {
  channelID = $('.search-term').val();
  search();
  console.log(channelID);
});

//search enter press
$(document).keypress(function(e) {
  var keycode = e.keyCode ? e.keyCode : e.which;
  if (keycode == '13') {
    channelID = $('.search-term').val();
    console.log(channelID);
    search();
  }
});

//top25 button
$('#top-25').on('click', function() {
  $('#logo').html(`<div></div>`);
  twitchTime();
  console.log(state);
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

twitchTime();
twitchUser();
