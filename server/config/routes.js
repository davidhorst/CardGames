var users = require('./../controllers/users.js');

module.exports = function(app) {
    app.post('/users/login', users.login);
    app.post('/users', users.register);
    app.get('/users/:id', users.show);
}
