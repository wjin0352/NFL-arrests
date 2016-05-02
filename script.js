$(function(){
  initialize();
});

var initialize = function() {
  fadingBody();
  getData('crime', showTopCrimes);
  getData('team', showTopTeams);
  getData('player', showTopPlayers);
  getInputPlayer();
  attachHideModalListener();
}

/* stores results from api call */
var listResults = {};

var html = {
  top_crimes_template:
    [
      '<div class="top_crimes"><h3>Top Crimes</h3></div>',
      '<table class="crimes-table table table-responsive table-bordered">',
        '<tr>',
          '<th>',
            '<span class="list-heading">Crime:</span>',
          '</th>',
          '<th>',
            '<span id="last_crime_span"># Arrests</span>',
          '</th>',
        '</tr>',
      '</table>'
    ].join(""),
  top_teams_template:
    [
      '<div class="top_teams"><h3>Top Teams</h3></div>',
      '<table class="teams-table table table-responsive table-bordered">',
        '<tr>',
          '<th>',
            '<span class="list-heading">Team:</span>',
          '</th>',
          '<th>',
            '<span id="last_team_span"># Arrests</span>',
          '</th>',
        '</tr>',
      '</table>'
    ].join(""),
  top_players_template:
    [
      '<div class="top_players"><h3>Top Players</h3></div>',
      '<table class="players-table table table-responsive table-bordered">',
        '<tr>',
          '<th>',
            '<span class="list-heading">Players:</span>',
          '</th>',
          '<th>',
            '<span id="last_player_span"># Arrests</span>',
          '</th>',
        '</tr>',
      '</table>'
    ].join("")
};

/* section3 */
  var editTag = function(tag) {
    // give tag a dash inbtwn names to get url for amazon S3 picture.
    var edit = tag.split(" ").join('-');
    return edit;
  }

  var scrollToAnchor = function(id){
    var aTag = $("a[href='"+ id +"']");
    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
  }

  /* players event handler for input box */
  var getInputPlayer = function() {
    $('form.main-user-input').on('submit', function(e) {
      e.preventDefault();
      var input = parseInput($('#user-input').val());
      if (!listResults.hasOwnProperty(input)) {
        getPlayerData(input, showPlayer);
      }
    });
  }

  var parseInput = function(data) {
    return data.toLowerCase();
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
      listResults[tag] = result;
      callback(tag, result);
    })
    .fail(function(jqXHR, error){
      console.log(error);
    });
  }

  var showPlayer = function(tag, result) {
    if (result.length == 0) {
      alert(tag + ' has no known offenses.');
    } else {
      createPlayerHtml(tag);
      appendPlayerHtml(tag);
      attachModalListener(tag);
      getModalPlayerItem(tag);
      getModalPlayerOffenses(tag);
    };
  }

  var createPlayerHtml = function(tag) {
    var edited_tag = editTag(tag);
    // item for main page .list
    var result_item =
      [
        '<div class="result-item">',
          '<img src="https://s3.amazonaws.com/nfl-arrests/profile-pics/' + edited_tag + '.png" alt="nfl player photo">',
          '<ul class="player-item">',
            '<li>Name: '+ listResults[tag][0].Name +'</li>',
            '<li>Team: '+ listResults[tag][0].Team +'</li>',
            '<li>Position: '+ listResults[tag][0].Position +'</li>',
            '<li>Last violation date: '+ listResults[tag][0].Date +'</li>',
            '<input type="submit" value="show rap sheet" data-player="'+listResults[tag][0].Name.toLowerCase()+'" class="btn btn-default" data-popup-open="popup-1">',
          '</ul>',
          '<hr>',
        '</div>'
      ].join("");
    listResults[tag]['listItem'] = result_item;
  }

  var appendPlayerHtml = function(tag) {
    $('.list-results').append(listResults[tag]['listItem']);
    scrollToAnchor('scroll');
    $('.result-item').fadeIn();
    $('.result-item').addClass('animated slideInUp');
  }

  var getModalPlayerItem = function(tag) {
    var edited_tag = editTag(tag);
    var result_player_item =
      [
        '<div id="player-container" class="append_to">',
          '<div id="player-bio" class="clearfix">',
            '<div class="player-photo">',
              '<img src="https://s3.amazonaws.com/nfl-arrests/profile-pics/' + edited_tag + '.png" width="100" height="100">',
            '</div>',
            '<div class="player-info">',
              '<p><strong>Name: </strong><span class="player-name">' + listResults[tag][0].Name + '&nbsp;&nbsp;</span></p>',
              '<p><strong>Position</strong>: '+ listResults[tag][0].Position +'&nbsp;</p>',
              '<p><strong>Current Team</strong>: '+ listResults[tag][0].Team +'</p>',
              '<p><strong># Of Offenses</strong>: '+ listResults[tag].length +'</p>',
            '</div>',
          '</div>',
        '</div>'
      ].join("");
    // save to listResults object for player
    listResults[tag]['modalIntro'] = result_player_item;
  }

  var getModalPlayerOffenses = function(tag) {
    var last_element = $('#player-container');
    var data = [];
    listResults[tag]['modalOffenses'] = [];
    for(var i=0; i<listResults[tag].length; i++) {
        var list_offenses =
          ['<hr>',
            '<div class="player-offenses">',
              '<div class="player-offense-info">' +
                '<p><strong>Offense: </strong><span>' + listResults[tag][i].Category + '&nbsp;&nbsp;</span></p>',
                '<p><strong>Date</strong>: '+ listResults[tag][i].Date +'&nbsp;',
                '<p><strong>Description</strong>: '+ listResults[tag][i].Description +'</p>',
                '<p><strong>Encounter</strong>: '+ listResults[tag][i].Encounter +'</p>',
                '<p><strong>Outcome</strong>: '+ listResults[tag][i].Outcome +'</p>',
                '<p><strong>Position</strong>: '+ listResults[tag][i].Position +'</p><p><strong>Team City</strong>: '+ listResults[tag][i].Team +'</p>',
              '</div>',
            '</div>'
          ].join("");

      data.push(list_offenses);
    };
    listResults[tag]['modalOffenses'] = data
  }

  var populateModal = function(tag) {
    $('.popup-inner').html(listResults[tag]['modalIntro']);
    $('#player-container').append(listResults[tag]['modalOffenses'].join(""));
  }

  var attachModalListener = function(tag) {
      // Event handler for show rap sheet button, and animation effects below
      var animation_name = 'animated zoomIn';
      var animation_end = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
      $('input[data-player="'+tag+'"]').on('click', function(){
        populateModal(tag);
        $('.popup').fadeIn(1000);
        $('.popup-middle').addClass(animation_name)
          // remove binding
          .on(animation_end, function() {
            $(this).removeClass(animation_name);
          });
      });
    }

  var attachHideModalListener = function() {
    $('[data-popup-close="popup-1"]').on('click', function(){
      $('.popup').fadeOut(1000);
      // on the close event, we remove the div#player-container and its contents.
      $('.popup-inner').children('#player-container').remove();
    });
  };

/* 2nd section .background, .feat1, .feat2, .feat3 */
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
    var last_span = $('.crimes-table');
    for(var i=0; i<result.length; i++) {
      var top_crimes =
        [
          '<tr class="top_crimes_list">',
            '<td>',
              '<span class="crime-cell">' + result[i].Category + '</span>',
            '</td>',
            '<td>',
              ' <span class="value-cell"> ' + result[i].arrest_count + '</span>',
            '</td>',
          '</tr>',
        ].join("");
      last_span.append(top_crimes);
    };
  };

  var showTopTeams = function(result) {
    appendTopTeamsTemplate();
    var last_span = $('.teams-table');
    for(var i=0; i<result.length; i++) {
      var top_teams =
        [
          '<tr class="top_teams_list">',
            '<td>',
              '<span class="team-cell">'+ result[i].Team +' </span>',
            '</td>',
            '<td>',
              '<span class="value-cell">'+ result[i].arrest_count +'</span>',
            '</td>',
          '</tr>',
        ].join("");
      last_span.append(top_teams);
    };
  };

  var showTopPlayers = function(result) {
    appendTopPlayersTemplate();
    var last_span = $('.players-table')
    var top_players =
      [
        '<tr class="top_players_list">',
          '<td>',
            '<span class="player-cell"></span></div>',
          '</td>',
          '<td>',
            '<span class="value-cell"></span></div>',
          '</td>',
        '</tr>',
      ].join("");
    for(var i=0; i<result.length; i++) {
      var top_players =
        [
          '<tr id="top_players_list">',
            '<td>',
              '<span>',
                 result[i].Name +
              '</span>',
            '</td>',
            '<td>',
              '<span class="value-cell">',
                 result[i].arrest_count +
              '</span>',
            '</td>',
          '</tr>'
        ].join("");
      last_span.append(top_players);
    };
  };

  /* END 2nd section .background */

  var fadingBody = function() {
    $('html').css('opacity', '0').fadeTo(1000, 1,'swing');
  }

