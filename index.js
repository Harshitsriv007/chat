const express = require("express");
const bodyparser = require("body-parser");
var path = require('path');

PORT = 5055;


app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname,'./client/public')));

const server = app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
});

const io = require('socket.io')(server);



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/public/index.html');
  });
  
  
  var name;
  
  io.on('connection', (socket) => {
    console.log('new user connected');
    
    socket.on('joining msg', (username) => {
        name = username;
        io.emit('chat message', `---${name} joined the chat---`);
        console.log(`${name} user connected`);
    });
    
    socket.on('disconnect', () => {
      console.log(`${name} user disconnected`);
      io.emit('chat message', `---${name} left the chat---`);
      
    });
    socket.on('chat message', (msg) => {
      socket.broadcast.emit('chat message', msg);         //sending message to all except the sender
    });
  });