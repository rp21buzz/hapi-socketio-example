'use strict';

exports.attachEvents = (server, io) => {
  io.on('connection',function(socket){
    socket.emit('Oh hii!');
    console.log(['websocket','success'], "client connected");
    console.log(['websocket','success'], socket.stringify());
  });
}
