'use strict'

exports.home = ( request, h ) => {
  return h.view('home', {
    title: 'hapi-socketio-sample Push Notifications POC' + request.server.version,
    nav_title: 'hapi-socketio-sample',
    nav_logo: ''
  });
}

exports.signup = ( request, h ) => {
  const { username } = request.payload;
  const resp = {
    success:  true,
    username: username,
    msg:  "All Went well"
  }
  return resp
}

exports.users = ( request, h ) => {
  return []
}

// exports. = ( request, h ) => {
//   return []
// }
