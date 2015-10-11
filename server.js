
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
app.use(express.session({secret: '1234567890QWERTY', key: 'limit'}));

var sessionList = {};
var yes_count = 0;
var no_count = 0;
var poll_disabled = true;
var current_question = '';

app.get('/',function(req,res){
    if(poll_disabled == false){
        if(req.sessionID in sessionList){
            if(sessionList[req.sessionID].hasVoted == 'yes'){
                res.redirect('/voted')
            }
            else{
                res.render('index.html', { 'question': current_question });
            }
        }
        else{
            req.session.hasVoted = 'no';
            sessionList[req.sessionID] = req.session;
            res.render('index.html', { 'question': current_question });
        }
    }
    else{
        res.render('poll_disabled.html');
    }
});

app.get('/voted', function (req, res) {
    req.session.hasVoted = 'yes';
    sessionList[req.sessionID] = req.session;
    res.render('already_voted.html');
});

app.get('/votes', function (req, res) {
    if(poll_disabled == false){
        res.render('votes.html', { 'question': current_question });
    }
    else{
        res.render('poll_disabled.html');
    }
  
});

app.get('/admin',function(req,res){
  res.render('admin.html', { 'question': current_question });
});


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
    
    socket.on('disable poll', function (data) {
        poll_disabled = true;
        console.log("Poll disabled")
    });
    
    socket.on('enable poll', function (data) {
        sessionList = {};
        yes_count = 0;
        no_count = 0;
        current_question = data['question'];
        poll_disabled = false;
        console.log("Current question:" + current_question);
        console.log("Poll enabled")
    });
    
    socket.on('disconnect', function (data) {
        console.log('\tUser disconnected');
    });

});
