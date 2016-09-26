'use strict';
var runningGames = require('./../runningGames.js');

class SocketRoutes {
    constructor() {

    }

    // const gameToPlayers = {};

    add(socket) {
        socket.on("gameJoin", function (data){
            //also check if player is in any other game and remove them
            // gameToPlayers[data.gameId].push(socket.id)
            socket.emit('gameJoined', 'you joined the game')
        });
        socket.on('gameCreate', function(data){
            // gameToPlayers.
            socket.emit('gameCreated', 'you created the game')
        });

        socket.on('gameMessage', function(data) {
            //player is sending data to current game. the game needs to be informed and parse the data
            runningGames.games[data.gameId].message(data);
        })
    }


}
module.exports = new SocketRoutes();
