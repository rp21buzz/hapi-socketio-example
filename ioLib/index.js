'use strict';

const Hoek = require('@hapi/hoek');
const SocketIo = require('socket.io');

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
        const ioServer = SocketIo.listen(server.listener, ioOptions);

        // attach events Listners & Handlers defined in ioLib
        const ioUtilities = require('./utilities');
        ioUtilities.attachEvents(server, ioServer);

        // expose the socket io
        server.expose('ioServer', ioServer);

        server.log(['ioLib','success'], "server socket created successfully");
      }catch(err){
        server.log(['ioLib','error'], "failed creating Server Socket");
        throw err
      }
    }

    await socketInit();
  },
};
