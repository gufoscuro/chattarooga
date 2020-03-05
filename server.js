const express       = require ('express');
const app    = express ();
const http        = require('http').Server(app);
const io = require('socket.io')(http);
const {users,rooms} = require('./server/state');
const path          = require ('path');


/**
 * Emits the list of rooms
 * @param {boolean} global true if the message should be dispatched to everybody
 * @param {Websocket} client 
 */
const roomsList = (global,client) => {
    if(global)
        client.to('_system').emit('rooms',rooms.rooms.map(room => room.name))
    else
        client.emit('rooms',rooms.rooms.map(room => room.name))
}

const roomUsers = (data,client) => {
    client.to(data.room).emit('users',rooms.get(data.room).users)
}

/**
 * Once a client has a username, it can emit the 'register' event. When triggered, the user presence is recorded and the list of the rooms
 * is emitted.
 * @param {object} data an object containing the 'username' key
 * @param {WebSocket} client the client
 */
const register = (data,client) => {
    if(users.push(data.username)){
        client.username = data.username
        client.join('_system')
        roomsList(false,client)
    } else client.close()
}

/**
 * Joins a room and emits confirmation
 * @param {object} data 
 * @param {WebSocket} client 
 */
const join = (data,client) => {
    console.log('User `'+client.username+'` joined `'+data.room+'`')
    /**
     * If the room does not exist, it'll be created, therefore we want to emit in the _system channel an updated list of rooms
     */
    if(!rooms.exists(data.room))
        roomsList(true,client)
    /**
     * A user gets pushed to a room. If the room does not exist, it gets created
     */
    rooms.pushUser(data.room,client.username)
    client.join(data.room)
    client.emit('join',{'joined':true,'room':data.room})
}
/**
 * Leaves a room and emits confirmation
 * @param {object} data 
 * @param {WebSocket} client 
 */
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

/**
 * Event triggered when a user disconnects. As a side effect, the user is removed from rooms
 * @param {WebSocket} client 
 */
const disconnect = (client) => {
    new Promise((resolve,reject) => resolve(users.remove(client.username)))
        .then(Promise.all(rooms.disconnectUser(client.username)).then((data) => console.log(data)))
}

/**
 * Main socket method bindings
 * @param {WebSocket} the websocket client
 */
const methods = (client) => {
    /**
     * On connect, a "username" event is triggered
     */
    users.generateName().then((data) => client.emit('username', {'username':data}))
    /**
     * Chat message event. Structure {id,type,author,text,room}
     */
    client.on('chat-message', (data) => message(data,client));
    /**
     * Register event. Structure {username}
     */
    client.on('register',(data) => register(data,client));
    /**
     * Disconnect event
     */
    client.on('disconnect', () => disconnect(client));
    /**
     * Join event. Structure  {room}
     */
    client.on('join', (data) => join(data,client));
    /**
     * Leave event.  Structure {room}
     */
    client.on('leave', (data) => leave(data,client));
    /**
     * Rooms list event.
     */
    client.on('rooms', () => roomsList(false,client));
    /**
     * Room's users list. {room}
     */
    client.on('room_users', (data) => roomUsers(data.room))
}

app.use (express.static (path.join (__dirname, 'public')));
app.get ('/', function (req, res) {
    res.sendFile (path.join (__dirname, './public', 'index.html'));
});

io.on('connection', methods);
http.listen (process.env.PORT || 3000)
// http.listen(80)