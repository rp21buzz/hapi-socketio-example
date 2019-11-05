'use strict';
//
const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
//
const Path = require('path');
const Inert = require('inert');
const Handlebars = require('handlebars');
//
const config = require('./config')[process.env.NODE_ENV || 'local'];
//
const init = async () => {

  const server = Hapi.server({
    port: config.server.port,
    host: config.server.host,
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'public')
      }
    }
  });

  // setup hapi default logging
  server.events.on('log', (event, tags) => {
    console.log(event)
    console.log(`${(new Date(event.timestamp)).toISOString()}:::${event.tags.join(':::')}:::${event.data ? event.data : 'unknown'}`);
  });

  // registering plugins
  await server.register([
    {
      plugin: require('./ioLib'),
      options: {
        io: {
          path: '/socketio',
          serveClient: true,
          transports: ['websocket', 'polling'],
          pingInterval: 10000,
          pingTimeout: 5000
        }
      }
    },{
      plugin: require('inert'),
      options: {}
    },{
      plugin: require('@hapi/vision'),
      options: {}
    }
  ]);

  // Configuring the Views HTML render engine to handlebars
  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'templates'
  });

  // Configuring Cookie settings
  server.state('hapi-socketio-sample', {
    ttl: null,
    isSecure: true,
    isHttpOnly: true,
    encoding: 'base64json',
    clearInvalid: true,
    strictHeader: true
  });

  //  Registering Routes
  server.route(require('./routes'));

  // Start the server
  await server.start();
  server.log(['server', 'success'], `running on ${server.info.uri}` );
};

try{
  init();
}catch(err){
  console.log(`[server, error] | ${err}`);
  throw err;
}
