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
                    // console.log('got into gameCreate')
                    const war = new War(guid(), data.userName, socket.id)
                    const gameId = runningGames.add(war);
                    // console.log('runningGames.games')
                    // console.log(runningGames.games)
                    const gameState = runningGames.games[gameId].getState();
                    console.log(gameState);
                    console.log('gameState');
                    // console.log('war player soket')
                    // console.log(socket.id)
                    // console.log(war.PlayerMap[0])
                    // console.log('gameID')
                    // console.log(gameId)
                    // console.log('runningGames')
                    // console.log(runningGames)
                    break;

            }
            //add player to 'room' socket?
            console.log('after switch')
            socket.join(gameId);
            socket.emit('gameCreated', gameState );
            // io.to(gameId).emit('returnMessage', 'this is a test');
        });

        socket.on('gameMessage', function(data) {
            //player is sending data to current game. the game needs to be informed and parse the data
            runningGames.games[data.gameId].recieveAction(data);
        })

        function guid(){
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                  .toString(16)
                  .substring(1);
            }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        }
    }
}
module.exports = new SocketRoutes();
