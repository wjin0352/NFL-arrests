$(function(){
  fadingBody();
  getData('crime', showTopCrimes);
  getData('team', showTopTeams);
  getData('player', showTopPlayers);
  getInputPlayer();
});

var html = {
  top_crimes_template: '<h3>Top Crimes</h3><span class="list-heading">Crime:</span><span id="last_crime_span"># Arrests</span>',
  top_teams_template: '<h3>Top Teams</h3><span class="list-heading">Team:</span><span id="last_team_span"># Arrests</span>',
  top_players_template: '<h3>Top Players</h3><span class="list-heading">Players:</span><span id="last_player_span"># Arrests</span>'
};

/* Header input & .list feature section3 */
  var showPlayer = function(tag, result) {
    console.log(result);
    if (result.length == 0) {
      alert(tag + ' has no known offenses.');
    } else {
      appendPlayerHtml(tag, result);
    };
  }

  var appendPlayerHtml = function(tag, result) {
    var edited_tag = editTag(tag);
    var result_item = '<div class="result-item"><img src="https://s3.amazonaws.com/nfl-arrests/profile-pics/' + edited_tag + '.png" alt="nfl player photo"><ul><li>Name: '+ result[0].Name +'</li><li>Team: '+ result[0].Team +'</li><li>Position: '+ result[0].Position +'</li><li>Last violation date: '+ result[0].Date +'</li><input type="submit" value="show rap sheet" class="btn btn-default" data-popup-open="popup-1"></ul><hr></div>';
    $('.list-results').append(result_item);
    scrollToAnchor('scroll');
    $('.result-item').fadeIn();
    $('.result-item').addClass('animated bounceIn');
    showModal2();
    // $('.result-item').fadeIn(2000)
    // wait until i append results, then call showModal2() event handler for button click
    // showModal2();
  }

  var scrollToAnchor = function(id){
    var aTag = $("a[href='"+ id +"']");
    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
  }

  var editTag = function(tag) {
    // give tag a dash inbtwn names to get url for amazon S3 picture.
    var edit = tag.split(" ").join('-');
    console.log(edit);
    return edit;
  }

  /* players event handler for input box */
  var getInputPlayer = function() {
    $('form.main-user-input').on('submit', function(e) {
      e.preventDefault();
      var input = $('#user-input').val();
      parseInput(input, showPlayer);
    });
  }

  var parseInput = function(data, callback) {
    var input = data.toLowerCase();
    // console.log(input);
    getPlayerData(input, callback);
  }

  var getPlayerData = function(tag, callback) {
    var request = {
      tag: tag
    };

    $.ajax({
      url: "http://nflarrest.com/api/v1/player/arrests/" + request.tag,
      data: request,
      dataType: "json",
      type: "GET",
    })
    .done(function(result){
      callback(tag, result);
    })
    .fail(function(jqXHR, error){
      console.log(error);
    });
  }
  /* End event handler for input box */



/* 2nd section .background */
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
/* END 2nd section .background */



/* modal2 features */
var showModal2 = function() {
  var animation_name = 'animated zoomInRight';
  var animation_end = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  $('input[data-popup-open="popup-1"]').on('click', function(){
    $('.popup').fadeIn(1000);
    $('.popup-inner').addClass(animation_name)
      // remove binding
      .on(animation_end, function() {
        $(this).removeClass(animation_name);
      });

    hideModal2();
  });
};

var hideModal2 = function() {
  var animation_name_1 = 'animated zoomOutUp';
  var animation_end = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  $('[data-popup-close="popup-1"]').on('click', function(){
    $('.popup').fadeOut();
    // $('.popup').addClass(animation_name_1)
    //   // remove binding
    //   .on(animation_end, function() {
    //     $(this).removeClass(animation_name_1)
    //   });
  });
};

var fadingBody = function() {
  // $('body').css('display', 'none').fadeIn(1500,'swing');
  $('html').css('opacity', '0').fadeTo(1000, 1,'swing');
}
/* End modal2 features */

