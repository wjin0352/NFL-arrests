$(function(){


getNflData('crime');
showModal();


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

// modal features
var showModal = function() {
  $('input[data-popup-open="popup-1"]').on('click', function(){
    // alert('yo');
    $('.popup').fadeIn(1000);
    hideModal();
  });
};

var hideModal = function() {
  $('[data-popup-close="popup-1"]').on('click', function(){
    $('.popup').fadeOut();
  });
};
