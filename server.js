const express       = require ('express');
const app    = express ();
const http        = require('http').Server(app);
const io = require('socket.io')(http);
const {users,rooms} = require('./server/state');
const path          = require ('path');



/**
 * The register operation
 * @param {object} data 
 * @param {WebSocket} client 
 */
const register = (data,client) => {
    if(users.push(data.username)){
        client.username = data.username
        client.emit('rooms',rooms.rooms.map(room => room.name))
    } else client.close()
}
/**
 * Handles the join to a room
 * @param {object} data 
 * @param {WebSocket} client 
 */
const join = (data,client) => {
    console.log('User `'+client.username+'` joined `'+data.room+'`')
    rooms.pushUser(data.room,client.username)
    client.join(data.room)
    client.emit('join',{'joined':true,'room':data.room})
}

const leave = (data,client) => {
    rooms.removeUser(data.username)
    client.leave(data.room)
    client.emit('leave',{'joined':false,'room':data.room})
}
/**
 * Handles message requests
 * @param {object} data 
 * @param {WebSocket} client 
 */
const message = (data,client) => {
    if(rooms.hasUser(data.room,client.username)) {
        console.log('`'+client.username+'` sent a message to room `'+data.room+'`')
        client.to(data.room).emit('chat-message',data)
    } else {
        console.log("Message from `"+client.username+"` for room `"+data.room+"` rejected")
        client.emit('err',{'status':400,'chat-message':'You haven\'t joined '+data.room})
    }
}

const disconnect = (client) => {
    new Promise((resolve,reject) => resolve(users.remove(client.username)))
        .then(Promise.all(rooms.disconnectUser(client.username)).then((data) => console.log(data)))
}

/**
 * Main socket method bindings
 * @param {WebSocket} the websocket client
 */
const methods = (client) => {
    users.generateName().then((data) => client.emit('username', {'username':data}))
    client.on('chat-message', (data) => message(data,client));
    client.on('register',(data) => register(data,client));
    client.on('disconnect', () => disconnect(client));
    client.on('join', (data) => join(data,client));
    client.on('leave', (data) => leave(data,client))
}

app.use (express.static (path.join (__dirname, 'public')));
app.get ('/', function (req, res) {
    res.sendFile (path.join (__dirname, './public', 'index.html'));
});

io.on('connection', methods);
http.listen (process.env.PORT || 3000)
// http.listen(80)