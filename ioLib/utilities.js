'use strict';

exports.attachEvents = (server, ioServer) => {
  ioServer.on('connection',function(socket){
    server.log(['websocket','success'], "client connected");
    // server.log(['websocket','success'], socket);
    setInterval(function(){socket.emit('hello', 'How are you?');}, 20000);
    socket.emit('hello', 'Oh hii!');
  });
}
