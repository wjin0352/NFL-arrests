$(function(){

fadingBody();
getData('crime', showTopCrimes);
// getData('team', showTopTeams);
// getData('player', showTopPlayers);
showModal2();

  // $('body').fadeOut(1000);

});

var html = {
  top_crimes_template: '<h3>Top Crimes</h3><span class="list-heading">Crime:</span><span id="last_span"># Arrests</span>',

  // top_teams_template: '<h3>Top Teams</h3><span class="list-heading">Team:</span><span># Arrests</span>' + '<ol id="top_teams_list"><li id="top_team_0"><a href="team.html#!DUI"><span>DUI</span><span class="value-cell">205</span></a></li><li id="top_team_1"><a href="team.html#!Domestic violence"><span>Domestic violence</span><span class="value-cell">91</span></a></li><li id="top_team_2"><a href="team.html#!Drugs"><span>Drugs</span><span class="value-cell">90</span></a></li><li id="top_team_3"><a href="team.html#!Assault"><span>Assault</span><span class="value-cell">66</span></a></li><li id="top_team_4"><a href="team.html#!Disorderly conduct"><span>Disorderly conduct</span><span class="value-cell">42</span></a></li></ol>',

  // top_players_template: '<h3>Top Players</h3><span class="list-heading">Players:</span><span># Arrests</span>' + '<ol id="top_players_list"><li id="top_player_0"><a href="player.html#!DUI"><span>DUI</span><span class="value-cell">205</span></a></li><li id="top_player_1"><a href="player.html#!Domestic violence"><span>Domestic violence</span><span class="value-cell">91</span></a></li><li id="top_player_2"><a href="player.html#!Drugs"><span>Drugs</span><span class="value-cell">90</span></a></li><li id="top_player_3"><a href="player.html#!Assault"><span>Assault</span><span class="value-cell">66</span></a></li><li id="top_player_4"><a href="player.html#!Disorderly conduct"><span>Disorderly conduct</span><span class="value-cell">42</span></a></li></ol>'
}

// $.ajax({
//   url: "http://NflArrest.com/api/v1/player/arrests/Adam%20Jones",
//   type: "GET",
//   success: console.log.bind(console)
// });

// 2nd section
    var getData = function (tag, callback) {
      var request = {
        tag: tag
      };

      $.ajax({
        url: "http://nflarrest.com/api/v1/"+ request.tag,
        data: request,
        dataType: "json",
        type: "GET",
      })
      .done(function(result){
        // console.log(result);
        callback(result);
      })
      .fail(function(jqXHR, error){
        console.log(error);
      });
    };

    var appendTopCrimesTemplate = function() {
      $('.feat1').append(html.top_crimes_template);
    }

    var showTopCrimes = function (result) {
      appendTopCrimesTemplate();

      var last_span = $('#last_span');

      for(var i=0; i<result.length; i++) {
        var top_crimes = '<ol id="top_crimes_list"><li id=""><a href="crime.html#!DUI"><span>' + result[i].Category + '</span><span class="value-cell"> ' + result[i].arrest_count + '</span></a></li></ol>'
        last_span.append(top_crimes);
            console.log(result[i]);
      };
    };

    // var showTopTeams = function(result) {
    //   console.log(result[0])
    //   $('.feat2').html(html.top_teams);
    // };

    // var showTopPlayers = function(result) {
    //   $('.feat3').html(html.top_players);
    // };

// modal1 features (for showing list of players)
// var showModal1 = function() {
//   $('form').on('submit', function(e) {
//     e.preventDefault();
//     $('.list-results').fadeIn(1000);
//   })
// }

// modal2 features
var showModal2 = function() {
  $('input[data-popup-open="popup-1"]').on('click', function(){
    // alert('yo');
    $('.popup').fadeIn(1000);
    hideModal2();
  });
};

var hideModal2 = function() {
  $('[data-popup-close="popup-1"]').on('click', function(){
    $('.popup').fadeOut();
  });
  // fadingBody();
};

var fadingBody = function() {
  // $('body').css('display', 'none').fadeIn(1500,'swing');
  $('html').css('opacity', '0').fadeTo(1000, 1,'swing');
}
