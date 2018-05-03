'use strict';
const nr = require('newrelic');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
//Setup ES6 Promise
mongoose.Promise = global.Promise;

//Define a model
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: String,
    email: String
});

const UserModel = mongoose.model('user', UserSchema);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function _startServer(_app) {
    /**
     * Get port from environment and store in Express.
     */
    const port = normalizePort(3000);

    /**
     * Event listener for HTTP server "error" event.
     */
    _app.on('error', (error) => {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.log('error', bind, ' requires elevated privileges');
                process.exit(-1);
                break;
            case 'EADDRINUSE':
                console.log('error', bind, ' is already in use');
                process.exit(-1);
                break;
            default:
                throw error;
        }
    });

    _app.set('port', port);
    return new Promise(function (resolve) {
        _app.listen(port, function() {
            console.log('info', 'Listening on', port);
            resolve();
        }.bind(this));
    }.bind(this));
}

_startServer(app)
.then(() => {
  return mongoose.connect('mongodb://localhost:27017/test');
})
.then(() => {
  app.get('/test', (req, res, next) => {
    UserModel.findOne({name: 'test'})
    .then((user) => {
      if (user) {
        res.send(user.toObject());
      } else {
        res.send();
      }
    })
    .catch((err) => {
      res.status(500).send({message: 'Failed'});
    })
  })
})
