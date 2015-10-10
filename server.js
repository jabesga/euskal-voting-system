// Setup basic express server
var express = require('express');
var app = express();
var path = require("path");
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;


server.listen(port, function () {
    console.log('\t :: Express :: Listening on port ' + port );
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static(__dirname + '/static'));

app.get('/',function(req,res){
  res.render('index.html');
});

app.get('/votes', function (req, res) {
  res.render('votes.html');
});

app.get('/admin',function(req,res){
  res.render('admin.html');
});

var yes_count = 0;
var no_count = 0;


io.on('connection', function (socket) {
    
    console.log('\tNew player connected');
    
    socket.on('special socket', function (data) {
        console.log("special socket created");
        socket.join('votes_showing_room');
        io.sockets.in('votes_showing_room').emit('update', {
            'yes': yes_count,
            'no': no_count,
        });
    });
    
    socket.on('vote yes', function (data) {
        yes_count++;
        io.sockets.in('votes_showing_room').emit('update', {
            'yes': yes_count,
            'no': no_count,
        });
        console.log("voted yes")
    });
    
    socket.on('vote no', function (data) {
        no_count++;
        io.sockets.in('votes_showing_room').emit('update', {
            'yes': yes_count,
            'no': no_count,
        });
        console.log("voted no")
    });
    
    socket.on('disconnect', function (data) {
        console.log('\tPlayer disconnected');
    });

});
