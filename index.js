const express = require("express");
const socketIO = require("socket.io");
const http = require ("http");
const app = express();
const server = http.createServer(app);
const io = socketIO(server); 
const path = require("path");

var users = {};
var name = '';

app.get('/:name', function(req, res){
    name = req.params.name;
    res.sendFile(path.join(__dirname, "/index.html"));
});

// socket
io.on("connection", function(socket){
    // console.log(socket)
    users[socket.id] = name;
    // node
    socket.on("nRoom", function(room){
        socket.join(room);
        socket.broadcast.in(room).emit("node new user", users[socket.id] + " new user has joined");
    });

    socket.on("node new message", function(data){
        io.in("nRoom").emit('node news', users[socket.id] + ": "+ data);
    });

    // python
    socket.on("pRoom", function(room){
        socket.join(room);
        socket.broadcast.in(room).emit("python new user", users[socket.id] + " new user has joined");
    });

    socket.on("python new message", function(data){
        io.in("pRoom").emit('python news', users[socket.id] + ": "+ data);
    });
//   socket.on("user disconnected",function(data){
//       io.broadcast.emit(data)
//   })
    
});

console.log('server is running at port:9000')
server.listen(9000);