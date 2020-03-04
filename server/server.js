const server = require('http').createServer();
const io = require('socket.io')(server);
const {users,rooms} = require('./state');

/**
 * The register operation
 * @param {object} data 
 * @param {WebSocket} client 
 */
const register = (data,client) => {
    if(users.push(data.username)){
        client.username = data.username
        console.log('User `'+data.username+'` connected')
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
        client.to(data.room).emit('request',data.message)
    } else {
        console.log("Message from `"+client.username+"` for room `"+data.room+"` rejected")
        client.emit('err',{'status':400,'message':'You haven\'t joined '+data.room})
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
    console.log('connect');
    client.on('message', (data) => message(data,client));
    client.on('register',(data) => register(data,client));
    client.on('disconnect', () => disconnect(client));
    client.on('join', (data) => join(data,client));
    client.on('leave', (data) => leave(data,client))
}

io.on('connection', methods);
server.listen(3000)