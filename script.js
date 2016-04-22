$(function(){







getNflData('crime');


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
