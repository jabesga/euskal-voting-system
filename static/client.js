$(function() {

  var socket = io();

  $("#yes_button").click( function(){
    socket.emit('vote yes');
    location.replace("/voted");
  });
  
  $("#no_button").click( function(){
    socket.emit('vote no');
    location.replace("/voted");
  });
  
});
