var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// var opn = require('opn');
var path = require('path');
var roomInfo = {};
var arrAllSocket = [];

io.on('connection', function(socket) {
    var url = socket.request.headers.referer;
    var roomID;
    var user;

    socket.on('join', function(obj) {
        user = obj.userName;
        roomID = obj.roomID;
        arrAllSocket[user] = socket;
        if (!roomInfo[roomID]) {
            roomInfo[roomID] = [];
        }
        roomInfo[roomID].push(user);

        socket.join(roomID);
        io.to(roomID).emit('sys', user + '加入了房间', roomInfo[roomID]);
        console.log(user + '加入了' + roomID);
    });

    socket.on('leave', function() {
        socket.emit('disconnect');
        console.log('disconnect');
    });

    socket.on('disconnect', function() {
        var index = roomInfo[roomID].indexOf(user);
        if (index !== -1) {
            roomInfo[roomID].splice(index, 1);
        }
        socket.leave(roomID);
        io.to(roomID).emit('sys', user + '退出了房间', roomInfo[roomID]);
        console.log(user + '退出了' + roomID);
    });

    socket.on('message', function(userName, toUserName, msg) {
        if (roomInfo[roomID].indexOf(userName) === -1) {
            return false;
        }
        console.log('userName', userName, 'toUserName', toUserName, 'msg', msg);
        if (toUserName) {
            var toTarget = arrAllSocket[toUserName];
            var target = arrAllSocket[userName];
            console.log(target);
            toTarget.emit('msg', userName, toUserName, msg);
            target.emit('msg', userName, toUserName, msg);
            console.log('private');
            return;
        }
        io.to(roomID).emit('msg', userName, toUserName, msg);
    });

    socket.on('private', function(name) {
        console.log(name);
    })

    socket.on('disconnect', () => {
        console.log('连接已断开...');
    });
});

var port = '5000';
var url = 'http://localhost:' + port;

server.listen(port, function() {
    console.log(url);
    // opn(url);
});

app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname, './index.html'));
});