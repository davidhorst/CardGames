'use strict';
var runningGames = require('./../runningGames.js');
var War = require('./../games/war.js');

class SocketRoutes {
    constructor() {
    }

    add(socket, io) {
        
        socket.on('gameCreate', function(data){
            switch(data.gameName) {
                case 'war':
                    // console.log('got into gameCreate')
                    const war = new War(guid(), data.userName, socket.id)
                    const gameId = runningGames.add(war);
                    // console.log('runningGames.games')
                    // console.log(runningGames.games)
                    const gameState = runningGames.games[gameId].getState();
                    // console.log(gameState);
                    // console.log('gameState');
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
            socket.join(gameId);
            socket.emit('gameCreated', gameState );
            io.to(gameId).emit('returnMessage', 'this is a test');
        });

        socket.on('gameMessage', function(data) {
            //player is sending data to current game. the game needs to be informed and parse the data
            const newState = runningGames.games[data.gameId].recieveAction(socket.id, data);
            io.to(data.gameId).emit(newState);
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
