'use strict';

const users = {};

exports.attachEvents = (server, ioServer) => {
  ioServer.on('connection',function(socket){
    server.log(['websocket','success'], "client connected");
    server.log(['websocket','success'], socket);
  });
  ioServer.on('broadcast', function(socket){
    server.log(['websocket','success'], socket);
  });
}
