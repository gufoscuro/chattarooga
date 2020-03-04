
var socket = require('socket.io-client')('http://localhost:3000');

socket.on('connect', () => {
    socket.emit('register',{'username':'Giuseppi'})
    socket.emit('join',{'room':'cani'})
  });

socket.on('join', (data) => {
  console.log(data)
  socket.emit('message',{'room':'cani','message':'robe da matti'})
});
socket.on('err',(data)=> {
  console.log(data)
})


socket.on('message', (data)=> {
    console.log(data)
});