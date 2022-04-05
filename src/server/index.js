const Connection = require('tedious').Connection;
const app = require('express')();

const http = require('http').Server(app);

const io = require("socket.io")(http, {
    cors: {
        origins: "*",
        methods: ["GET", "POST"]
    },
});

const login = require('./login.js')
const DB = require('./db.js')

let users = [];


io.on('connection', function(socket){
    socket.on('addActiveUser',data =>{
        users.push(data);
        console.log(users);
    })
    socket.on('deleteActiveUser',data =>{
        console.log("Before: " + users);
        users.splice(users.indexOf(data));
        console.log("After: " + users);
    })

    socket.on('userLogin', data => {
        console.log(data.login + ' пытается присоединиться');
        if (users.indexOf(data.login) > -1) {
            // Если в массиве users[] уже есть такое значение, то
            socket.emit("DBError",{message:"Пользователь с таким именем уже существует"})
            console.log("Пользователь с таким именем уже существует");
        } else {
            let config = login.setConfig(data.login, data.password);
            const DBconnection = new Connection(config);
            DB.CreateConnection(DBconnection, socket, data.login)
        }
    });


});
/*
http.listen(login.port, function() {
    console.log('listening on port '+login.port);
});*/
http.listen(login.port,'0.0.0.0', function() {
    console.log('listening on port '+login.port);
});


