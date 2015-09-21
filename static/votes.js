$(function() {

  var socket = io();
  
  socket.emit('special socket');

  socket.on('update', function (data) {
      /* global myBarChart */
      myBarChart.datasets[0].bars[0].value = data.yes;
      myBarChart.datasets[0].bars[1].value = data.no;
      myBarChart.update();
  });
});
