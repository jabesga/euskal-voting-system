$(function() {

  var socket = io();

  $("#yes_button").click( function(){
    socket.emit('vote yes');
    //location.replace("https://euskal-voting-system-jabesga-1.c9.io/votes")
  });
  
  $("#no_button").click( function(){
    socket.emit('vote no');
    //location.replace("https://euskal-voting-system-jabesga-1.c9.io/votes")
  });
  
});
