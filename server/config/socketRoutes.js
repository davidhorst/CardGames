'use strict';
var runningGames = require('./../runningGames.js');
var War = require('./../games/war.js');

class SocketRoutes {
    constructor() {

    }

    add(socket, io) {

        socket.on("showGames", function(data, cb){
          const gamesArr = runningGames.show(data);
          cb({ data: gamesArr });
        });

        socket.on('gameCreate', function(data, cb){
            switch(data.gameName) {
                case 'war':
                    const war = new War(guid(), data.userName, socket.id)
                    const gameId = runningGames.add(war);
                    const gameState = runningGames.games[gameId].getState();
                    cb(war.getState());
                    break;

            }
            socket.join(gameId);
            socket.emit('gameCreated', gameState );

            io.to(gameId).emit('returnMessage', 'this is a test');
        });

        socket.on('gameMessage', function(data) {
          //player is sending data to current game. the game needs to be informed and parse the data
          const newState = runningGames.games[data.gameId].recieveAction(socket.id, data, io);
          io.to(data.gameId).emit(newState);
        });

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

    remove(socket, io) {
        io.to(socket.gameId).emit('returnMessage', 'this is a test');
        //remove player from game they are in.
        //if game is empty destroy game.
    }

}
module.exports = new SocketRoutes();
