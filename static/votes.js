$(function() {

  var socket = io();
  
  socket.emit('special socket');
  
  socket.on('update', function (data) {
      
      /* global update */
      update(data.yes, data.no);
  });
});
