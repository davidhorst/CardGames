'use strict';

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
    }


}
module.exports = new SocketRoutes();
