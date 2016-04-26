$(function(){

fadingBody();
getData('crime', showTopCrimes);
getData('team', showTopTeams);
getData('player', showTopPlayers);
showModal1();
showModal2();

  // $('body').fadeOut(1000);

});

var html = {
  top_crimes_template: '<h3>Top Crimes</h3><span class="list-heading">Crime:</span><span id="last_crime_span"># Arrests</span>',
  top_teams_template: '<h3>Top Teams</h3><span class="list-heading">Team:</span><span id="last_team_span"># Arrests</span>',
  top_players_template: '<h3>Top Players</h3><span class="list-heading">Players:</span><span id="last_player_span"># Arrests</span>',
  result_item: '<div class="result-item"><img src="https://s3.amazonaws.com/nfl-arrests/profile-pics/adam-jones.png" alt="nfl player photo"><ul><li>Name: Adam Jones</li><li>Team: NY Giants</li><li>Position: Line backer</li><li>Last violation date: 01/15/2016</li><input type="submit" value="show rap sheet" class="btn btn-default" data-popup-open="popup-1"></ul><hr></div>'
};

// list feature
  var getResultItem = function() {

  }

  var showModal1 = function() {
  $('form.main-user-input').on('submit', function(e) {
    e.preventDefault();
    var input = $('#user-input').val();

  });
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
    };
    var appendTopTeamsTemplate = function() {
      $('.feat2').append(html.top_teams_template);
    };
    var appendTopPlayersTemplate = function() {
      $('.feat3').append(html.top_players_template);
    }

    var showTopCrimes = function (result) {
      appendTopCrimesTemplate();

      var last_span = $('#last_crime_span');

      for(var i=0; i<result.length; i++) {
        var top_crimes = '<ol id="top_crimes_list"><li id=""><a href="crime.html#!DUI"><span>' + result[i].Category + '</span><span class="value-cell"> ' + result[i].arrest_count + '</span></a></li></ol>'
        last_span.append(top_crimes);
            // console.log(result[i]);
      };
    };

    var showTopTeams = function(result) {
      appendTopTeamsTemplate();

      var last_span = $('#last_team_span');

      for(var i=0; i<result.length; i++) {
        var top_teams = '<ol id="top_teams_list"><li id="top_team_0"><a href="team.html#!DUI"><span>'+ result[i].Team +' </span><span class="value-cell">'+ result[i].arrest_count +'</span></a></li></ol>';
        last_span.append(top_teams);
      };
    };

    var showTopPlayers = function(result) {
      appendTopPlayersTemplate();
      var last_span = $('#last_player_span')
      var top_players = '<ol id="top_players_list"><li id="top_player_0"><a href="player.html#!DUI"><span>DUI</span><span class="value-cell">205</span></a></li></ol>'
      // console.log(result)
      for(var i=0; i<result.length; i++) {
        var top_teams = '<ol id="top_teams_list"><li id="top_team_0"><a href="team.html#!DUI"><span>'+ result[i].Name +' </a><span class="value-cell">'+ result[i].arrest_count +'</span></li></ol>';
        last_span.append(top_teams);
        // console.log(result[i])
      };
      // var id = 'Name';
      // var attribute = 'Position';
      // loopResultsHtml(result, id, attribute, last_span);

    };

    //  This doesnt work?!  why cant i pass in variables as parameters and run them on objects
    var loopResultsHtml = function(result, id, attribute, last_span) {
      var i = id;
      // console.log(result[0].i);
      for(var i=0; i<result.length; i++) {
        // console.log(result[i]);
        var top_teams = '<ol id="top_' + id +'"><li"><a href="team.html#!DUI"><span>'+ result[i].attr +'</span><span class="value-cell">'+ result[i].arrest_count +'</span></a></li></ol>';
        last_span.append(top_teams);
      }
    };

// <li id="top_player_1"><a href="player.html#!Domestic violence"><span>Domestic violence</span><span class="value-cell">91</span></a></li><li id="top_player_2"><a href="player.html#!Drugs"><span>Drugs</span><span class="value-cell">90</span></a></li><li id="top_player_3"><a href="player.html#!Assault"><span>Assault</span><span class="value-cell">66</span></a></li><li id="top_player_4"><a href="player.html#!Disorderly conduct"><span>Disorderly conduct</span><span class="value-cell">42</span></a></li>


// modal2 features
var showModal2 = function() {
  $('input[data-popup-open="popup-1"]').on('click', function(){
    $('.popup').fadeIn(1000);
    hideModal2();
  });
};

var hideModal2 = function() {
  $('[data-popup-close="popup-1"]').on('click', function(){
    $('.popup').fadeOut();
  });
};

var fadingBody = function() {
  // $('body').css('display', 'none').fadeIn(1500,'swing');
  $('html').css('opacity', '0').fadeTo(1000, 1,'swing');
}
