'use strict';

const handlers = require('./controllers');

module.exports = [
  {
    // To serve static files in a relative path fashion to basedir 'public'
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true
      }
    }
  },{
    // Root Route
    method: ['GET','POST'],
    path: '/',
    handler: handlers.home,
    options: {
      state: {
        parse: true,
        failAction: 'error'
      }
    }
  },{
    // Root Route
    method: ['GET','POST'],
    path: '/home',
    handler: handlers.home,
    options: {
      state: {
        parse: true,
        failAction: 'error'
      }
    }
  },{
    // Signup route
    method: 'POST',
    path: '/signup',
    handler: handlers.signup,
    options: {
      state: {
        parse: true,
        failAction: 'error'
      }
    }
  },{
    // list loggedIn users route
    method: 'GET',
    path: '/users',
    handler: handlers.users,
    options: {
      state: {
        parse: true,
        failAction: 'error'
      }
    }
  }
]
