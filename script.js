$(function(){

fadingBody();
getNflData('crime');
showModal2();

  // $('body').fadeOut(1000);

});

var getNflData = function(user_input) {
  // parameters to pass into our request to NFL Arrest API
  var request = {
    tag: user_input
  };

  console.log(request.tag);

  $.ajax({
    url: "http://nflarrest.com/api/v1/"+ user_input,
    data: request,
    dataType: "json",
    type: "GET",
  })
  .done(function(result){
    console.log(result);
  })
  .fail(function(jqXHR, error){
    console.log(error);
  });
};

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
