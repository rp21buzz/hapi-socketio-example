'use strict';

const users = {};
const rooms = {
  'public': []
};
let publicBoard = "Hello How are you ?"

exports.attachEvents = (server, ioServer) => {
  ioServer.on('connection',function(socket){
    server.log(['websocket','success'], "client connected");
    ioServer.to(`${socket.id}`).emit('publicBoardUpdate', publicBoard);
    // server.log(['websocket','success'], socket);
    //
    socket.join('public', () => {
      rooms.public.push(socket.id);
      console.log(rooms); // [ <socket.id>, 'room 237' ]
    });
    //
    socket.on('disconnect', () => {
      let tusr = ''
      for (let usr in users){
        tusr = usr;
        let tindex =  users[tusr].indexOf(socket.id);
        if( tindex > -1 ){
          users[usr].splice(tindex,1);
        }
      }
      if(tusr && users[tusr].length == 0){
        delete users[tusr];
        delete rooms[tusr];
      }
    });
    //
    socket.on('subscribe', (username) => {
      server.log(['websocket','subscribe','success'], username);
      let tusers = Object.keys(users);
      let trooms = ['public'];
      trooms.push(username);
      if(tusers.indexOf(username)>-1){
        let active_sessions = users[username];
        if(active_sessions.indexOf(socket.id)<0){
          active_sessions.push(socket.id);
          rooms[username].push(socket.id);
          socket.join(trooms);
        }
      }else{
        users[username] = [socket.id];
        rooms[username] = [socket.id];
        socket.join(trooms);
      }
      // socket.broadcast.emit('users', users);
      ioServer.emit('users', users);
    });
    //
    socket.on('pushNotify-all', (data) => {
      let tdata = JSON.parse(data);
      server.log(['websocket','pushNotify-all','success'], tdata);
      // socket.to('public').emit('pushNotify-all', { msg: tdata[0].value });
      socket.broadcast.emit('pushNotify-all', { msg: tdata[0].value });
    });
    //
    socket.on('pushNotify-user', (data) => {
      let tdata = JSON.parse(data);
      let user_rooms = [];
      let msg = '';
      for (let item of tdata) {
        if(item.name == 'user'){
          user_rooms.push(item.value);
        }else{
          msg = item.value;
        }
      }
      server.log(['websocket','pushNotify-user','success'], JSON.stringify(user_rooms));
      for (let room of user_rooms) {
        if(Object.keys(rooms).indexOf(room) > -1){
          server.log(['websocket','pushNotify-user','success'], JSON.stringify(room));
          socket.to(room).emit('pushNotify-user', { msg: msg });
        }
      }
    });
    //
    socket.on('publicBoardRemoteLock', (lockstate) => {
      server.log(['websocket','pushNotify-user','success'], JSON.stringify(user_rooms));
      socket.broadcast.emit('publicBoardRemoteLock', lockstate)
    });
    //
    socket.on('publicBoardUpdate', (content) => {
      server.log(['websocket','publicBoardUpdate','success'], content);
      publicBoard = content;
      server.log(['websocket','publicBoardUpdate','success'], publicBoard);
      socket.broadcast.emit('publicBoardUpdate', publicBoard);
    });
  });
}
