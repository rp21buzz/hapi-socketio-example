'use strict';

exports.attachEvents = (server, ioServer) => {
  ioServer.on('connection',function(socket){
    server.log(['websocket','success'], "client connected");
    server.log(['websocket','success'], socket.stringify());
    setTimeout(function(){emitMessage(socket)}, 1000);
    socket.emit('Oh hii!');
  });
}
