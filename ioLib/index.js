'use strict';

const Hoek = require('@hapi/hoek');
const socketIo = require('socket.io');

module.exports = {
  name: 'ioLib',
  version: '1.0.0',
  register: async function (server, options) {
    //
    const socketInit = () => {
      try{
        // clean options provided
        const ioOptions = Hoek.applyToDefaults({}, options.io);
        server.log(['ioLib','success'], JSON.stringify(ioOptions));

        // instantiate socket.io
        const io = socketIo(server.listner, ioOptions);

        // attach events Listners & Handlers defined in ioLib
        // const ioUtilities = require('./utilities');
        // ioUtilities.attachEvents(server, server.plugins.ioLib.io);

        io.on('connection',function(socket){
          socket.emit('Oh hii!');
          console.log(['websocket','success'], "client connected");
          console.log(['websocket','success'], socket.stringify());
        });

        // expose the socket io
        server.expose('io', io);

        server.log(['ioLib','success'], "server socket created successfully");
      }catch(err){
        server.log(['ioLib','error'], "failed creating Server Socket");
        throw err
      }
    }

    await socketInit();
  },
};
