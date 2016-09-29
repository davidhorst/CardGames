'use strict';
const express    = require( 'express' ),
      bp           = require('body-parser'),
      expressjwt   = require('express-jwt'),
      jwt          = require('jsonwebtoken'),
      path         = require('path'),
      cookieparser = require("cookie-parser"),
      // socketRoutes = require('./server/config/socketRoutes'),
      root         = __dirname,
      port         = process.env.PORT || 8000,
      app          = express();

app.use(express.static(path.join(root, './client' )));
app.use(express.static(path.join(root, 'bower_components' )));
app.use(bp.json());
app.use(cookieparser());
app.use(expressjwt({
    secret: 'so secret',
    getToken: function(req) { return req.cookies.token; }
}).unless({ path: ['/users', '/users/login'] }));


require('./server/config/mongoose.js');

var users = require('./server/controllers/users.js');
const socketRoutes = require('./server/config/socketRoutes');

require('./server/config/routes.js')(app, users);


const server = app.listen( port, function() {
  console.log( `server running on port ${ port }` );
});

const io = require('socket.io').listen(server)

io.sockets.on('connection', function (socket) {
    socketRoutes.add(socket, io);
});
io.sockets.on('disconnect', function(socket) {
    socketRoutes.remove(socket, io);
})
