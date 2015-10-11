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

app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY', key: 'Cookie'}));

var sessionList = {};

app.get('/',function(req,res){
  if(req.sessionID in sessionList){
	if(sessionList[req.sessionID].hasVoted == 'yes'){
		res.render('already.html');
	}
	else{
		res.render('index.html')
	}
  }
  else{
	  req.session.hasVoted = 'no';
	  sessionList[req.sessionID] = req.session;
	  res.render('index.html')
  }
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
    
    console.log('\tNew user connected');
    
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
        console.log("Someone voted YES")
    });
    
    socket.on('vote no', function (data) {
        no_count++;
        io.sockets.in('votes_showing_room').emit('update', {
            'yes': yes_count,
            'no': no_count,
        });
        console.log("Someone voted NO")
    });
    
    socket.on('disconnect', function (data) {
        console.log('\tUser disconnected');
    });

});
