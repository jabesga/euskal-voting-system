$(function() {

  var socket = io();

  $("#yes_button").click( function(){
    socket.emit('vote yes');
  });
  
  $("#no_button").click( function(){
    socket.emit('vote no');
  });
  
});
