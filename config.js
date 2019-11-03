'use strict';

exports.local = {
  "server":{
    "protocol": "http",
    "port" : 3000,
    "host" : "192.168.0.100"
  },
  "database": {
    "user": "",
    "password": "",
    "database": "",
    "host": "",
    "port": 0,
    "max": 10,
    "idleTimeoutMillis": 30000
  },
  "redis":{
    "host": "",
    "port": ""
  }
}

exports.dev = {
  "server":{
    "protocol": "http",
    "port" : 3000,
    "host" : process.env.HOST
  },
  "database": {
    "user": "",
    "password": "",
    "database": "",
    "host": "",
    "port": 0,
    "max": 10,
    "idleTimeoutMillis": 30000
  },
  "redis":{
    "host": "",
    "port": ""
  }
}
