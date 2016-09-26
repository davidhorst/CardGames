'use strict';
var runningGames = require('./../runningGames.js');
var War = require('./../games/war.js');

class SocketRoutes {
    constructor() {

    }

    add(socket) {
        socket.on("gameJoin", function(data){
            //also check if player is in any other game and remove them

            //bug need if check to see if the add worked. people might click enter at same time!
            gameObj = runningGames[data.gameId];
            gameObj.add(data.userName, socket.id)
            socket.join(data.gameId);
            socket.emit('gameJoined', gameObj.getState())
        });

        socket.on('gameCreate', function(data){
            switch(data.gameName) {
                case 'war':
                    console.log('got into gameCreate')
                    const war = new War();
                    gameId = runningGames.add(war);
                    gameState = runningGames[gameId].getState();
                    console.log('war')
                    console.log(war)
                    console.log('gameID')
                    console.log(gameID)
                    console.log('runningGames')
                    console.log(runningGames)
                    break;

            }
            //add player to 'room' socket?
            socket.join(gameId);
            socket.emit('gameCreated', gameState )
        });

        socket.on('gameMessage', function(data) {
            //player is sending data to current game. the game needs to be informed and parse the data
            runningGames.games[data.gameId].recieveAction(data);
        })
    }


}
module.exports = new SocketRoutes();
