$(function(){
  initialize();
});

var initialize = function() {
  fadingBody();
  getData('crime', showTopCrimes);
  getData('team', showTopTeams);
  getData('player', showTopPlayers);
  getInputPlayer();
}

var html = {
  top_crimes_template: '<h3>Top Crimes</h3><span class="list-heading">Crime:</span><span id="last_crime_span"># Arrests</span>',
  top_teams_template: '<h3>Top Teams</h3><span class="list-heading">Team:</span><span id="last_team_span"># Arrests</span>',
  top_players_template: '<h3>Top Players</h3><span class="list-heading">Players:</span><span id="last_player_span"># Arrests</span>'
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
      var input = $('#user-input').val();
      parseInput(input, showPlayer);
    });
  }

  var showPlayer = function(tag, result) {
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
    // click event handler for button on the newly appended list
    showModal(tag, result);
    // click event handler to be able to click on list item again
    showModalAgain();
  }

  var parseInput = function(data, callback) {
    var input = data.toLowerCase();
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

  var showModal = function(tag, result) {
    var edited_tag = editTag(tag);
    // setup the html to append to .popup modal
      var result_player_item = '<div id="player-container" class="append_to"><div id="player-bio" class="clearfix"><div class="player-photo"><img src="https://s3.amazonaws.com/nfl-arrests/profile-pics/' + edited_tag + '.png" width="100" height="100"></div><div class="player-info"><p><strong>Name: </strong><span class="player-name">' + result[0].Name + '&nbsp;&nbsp;</span></p><p><strong>Position</strong>: '+ result[0].Position +'&nbsp;<p><strong>Current Team</strong>: '+ result[0].Team +'</p><p><strong># Of Offenses</strong>: '+ result.length +'</p></div></div></div>';
    // append html to the modal
      $('.popup-inner').append(result_player_item);
    // find the last element so we can append the player offenses next
    var last_element = $('#player-container');
    // get the rest of the results by looping through the objects of result, and set up html to append to last element
    showPlayerOffenses(last_element, result);

    // Event handler for show rap sheet button, and animation effects below
    var animation_name = 'animated zoomInRight';
    var animation_end = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    $('input[data-popup-open="popup-1"]').one('click', function(){
      $('.popup').fadeIn(1000);
      $('.popup-middle').addClass(animation_name)
        // remove binding
        .on(animation_end, function() {
          $(this).removeClass(animation_name);
        });
      hideModal2();
    });
  };

  var showPlayerOffenses = function(element, result) {
    // loops through the rest of the objects to create the offenses list
    for(var i=0; i<result.length; i++) {
      var list_offenses = '<hr><div class="player-offenses"><div class="player-offense-info">' +
        '<p><strong>Offense: </strong><span>' + result[i].Category + '&nbsp;&nbsp;</span></p><p><strong>Date</strong>: '+ result[i].Date +'&nbsp;<p><strong>Description</strong>: '+ result[0].Description +'</p><p><strong>Encounter</strong>: '+ result[i].Encounter +'</p><p><strong>Outcome</strong>: '+ result[i].Outcome +'</p><p><strong>Position</strong>: '+ result[i].Position +'</p><p><strong>Team City</strong>: '+ result[i].Team +'</p>'
        + '</div></div>'
      element.append(list_offenses);
    };
  }

  var hideModal2 = function() {
    $('[data-popup-close="popup-1"]').on('click', function(){
      $('.popup').fadeOut(1000);
      // on the close event, we remove the div#player-container and its contents.
      $('.popup-inner').children('#player-container').remove();
    });
  };

  var showModalAgain = function() {
    $('input[value="show rap sheet"]').on('click', function (e) {
      var name = $(this).siblings('li').first().text().split(': ')[1].toLowerCase();
      // parse the name
        editTag(name);
      // ajax call
      repeatPlayerData(name);

      console.log('hello');
    });
  }

  var repeatPlayerData = function(name) {
    $.ajax({
      url: "http://nflarrest.com/api/v1/player/arrests/" + name,
      data: name,
      dataType: "json",
      type: "GET",
    })
    .done(function(result){
      appendPlayerHtmlAgain(name, result);
      // return result; this gave me undefined on the other function! why?
    })
    .fail(function(jqXHR, error) {
      console.log(error);
    });
  }

  var appendPlayerHtmlAgain = function(tag, result) {
    var edited_tag = editTag(tag);
    // create the html to append
    var result_player_item = '<div id="player-container" class="append_to"><div id="player-bio" class="clearfix"><div class="player-photo"><img src="https://s3.amazonaws.com/nfl-arrests/profile-pics/' + edited_tag + '.png" width="100" height="100"></div><div class="player-info"><p><strong>Name: </strong><span class="player-name">' + result[0].Name + '&nbsp;&nbsp;</span></p><p><strong>Position</strong>: '+ result[0].Position +'&nbsp;<p><strong>Current Team</strong>: '+ result[0].Team +'</p><p><strong># Of Offenses</strong>: '+ result.length +'</p></div></div></div>';

    // append newly created html to the popup .popup-inner
    $('.popup-inner').append(result_player_item);
    var last_element = $('#player-container');

    // get the rest of the offenses list from result
    showPlayerOffenses(last_element, result);
      var animation_name = 'animated zoomInRight';
      var animation_end = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

    // create event handler for player rap sheet button
    $('input[data-popup-open="popup-1"]').one('click', function(){
      $('.popup').fadeIn(1000);
      $('.popup-middle').addClass(animation_name)
        // remove binding
        .on(animation_end, function() {
          $(this).removeClass(animation_name);
        });
      hideModal2();
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
    var last_span = $('#last_crime_span');
    for(var i=0; i<result.length; i++) {
      var top_crimes = '<ol id="top_crimes_list"><li id=""><span>' + result[i].Category + '</span><span class="value-cell"> ' + result[i].arrest_count + '</span></a></li></ol>'
      last_span.append(top_crimes);
    };
  };

  var showTopTeams = function(result) {
    appendTopTeamsTemplate();
    var last_span = $('#last_team_span');
    for(var i=0; i<result.length; i++) {
      var top_teams = '<ol id="top_teams_list"><li id="top_team_0"><span>'+ result[i].Team +' </span><span class="value-cell">'+ result[i].arrest_count +'</span></a></li></ol>';
      last_span.append(top_teams);
    };
  };

  var showTopPlayers = function(result) {
    appendTopPlayersTemplate();
    var last_span = $('#last_player_span')
    var top_players = '<ol id="top_players_list"><li id="top_player_0"><a href="player.html#!DUI"><span>DUI</span><span class="value-cell">205</span></a></li></ol>'
    for(var i=0; i<result.length; i++) {
      var top_teams = '<ol id="top_teams_list"><li id="top_team_0"><a href="team.html#!DUI"><span>'+ result[i].Name +' </a><span class="value-cell">'+ result[i].arrest_count +'</span></li></ol>';
      last_span.append(top_teams);
    };
  };

  var loopResultsHtml = function(result, id, attribute, last_span) {
    var i = id;
    for(var i=0; i<result.length; i++) {
      var top_teams = '<ol id="top_' + id +'"><li"><a href="team.html#!DUI"><span>'+ result[i].attr +'</span><span class="value-cell">'+ result[i].arrest_count +'</span></a></li></ol>';
      last_span.append(top_teams);
    }
  };

  /* END 2nd section .background */

  var fadingBody = function() {
    $('html').css('opacity', '0').fadeTo(1000, 1,'swing');
  }

