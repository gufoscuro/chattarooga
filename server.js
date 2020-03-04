const express       = require ('express');
const app           = express ();
const path          = require ('path');
const http          = require ('http').Server(app);
const io            = require ('socket.io')(http);

app.use (express.static (path.join (__dirname, 'public')));

app.get ('/', function (req, res) {
    res.sendFile (path.join (__dirname, './public', 'index.html'));
});

io.on ('connection', function (socket) {
    console.log ('a user connected');

    socket.on ('disconnect', function () {
        console.log ('a user disconnected');
    });

    socket.on ('user-writing', function (data) {
        console.log ('a user is', (data.writing ? 'writing' : 'not-writing'));
    });

    socket.on ('chat-message', function (data) {
        console.log ('chat-message', data);
        socket.emit ('chat-message', data);
    });
});




const server = http.listen(3003, function() {
    console.log('listening on *:3003');
});