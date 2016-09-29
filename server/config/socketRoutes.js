'use strict';
var runningGames = require('./../runningGames.js');
var War = require('./../games/war.js');
var messages = [];
class SocketRoutes {
    constructor() {
    }

    add(socket, io) {
        socket.on("showGames", function(data, cb){
          const gamesArr = runningGames.show(data);
          cb({ data : gamesArr });
          // socket.emit('showGames', { data: gamesArr })
        });

        socket.on('gameCreate', function(data, cb){
            let war;
            let gameId;
            let gameState;

            switch(data.gameName) {
                // , data.userName, socket.id
                case 'war':
                    war = new War(guid())
                    gameId = runningGames.add(war);
                    gameState = runningGames.games[gameId].getState();
                    // Add User to game
                    war.add(data.userName, socket.id);
                    // return data to the socketsFactory
                    cb(war.getState());
                    let messageObj = {
                      gameId: war.gameId,
                      username: "Host",
                      message: `${data.userName} started a game of War`
                    };
                    messages.push(messageObj);
                    io.emit('updateMessages', messages);
                    break;

            }
            // join socket to game room
            socket.join(gameId);
            // returns game state
            // socket.emit('gameCreated', gameState );
            // emit message to entire room
            io.emit("updateGames");
            io.to(gameId).emit("gameResponse", gameState);

        });

        socket.on('joinGame', function(data, cb) {
           let game = runningGames.get(data.gameId);
           socket.join(data.gameId);
           let player = game.add(data.userName, socket.id)
           let obj = {player: player, gameState: game.getState()};
           let message = `${player.name} has joined the game`;
           io.emit('joinedGame', message);
           io.to(data.gameId).emit("gameResponse", game.getState() );
           cb(obj);
        });

        socket.on('gameMessage', function(data) {
          //player is sending data to current game. the game needs to be informed and parse the data
          const newState = runningGames.games[data.gameId].recieveAction(socket.id, data, io);
          io.to(data.gameId).emit(newState);
        });

        // return existing messages to requesting client
        socket.on("getMessages", function(cb){
          cb({ data : messages });
        });

        socket.on('addMessage', function(msgObj, cb){
          messages.push(msgObj);
          io.emit('updateMessages', { data: messages} )
          cb();
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
        if(runningGames[socket.gameId].playerMap.length === 0) {
            delete runningGames[socket.gameId];
        }
    }

}
module.exports = new SocketRoutes();
