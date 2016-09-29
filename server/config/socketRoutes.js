'use strict';
var runningGames = require('./../runningGames.js');
var War = require('./../games/war.js');
var messages = [];


class SocketRoutes {
    constructor() {
      this.users = require('./../controllers/users.js');
    }

    add(socket, io) {

        var self = this;

        socket.on("showGames" ,function(data, cb){
          const gamesArr = runningGames.show(data);
          cb({ data : gamesArr });
          // socket.emit('showGames', { data: gamesArr })
        });

        socket.on('gameCreate', function(data, cb){
            let war,
                gameId,
                gameState;

            switch(data.gameName) {
                case 'war':
                    war = new War(guid())
                    gameId = runningGames.add(war);
                    gameState = runningGames.games[gameId].getState();
                    // Add User to game
                    war.add(data.userName, data.userId, socket.id);
                    // return data to the socketsFactory
                    cb(war.getState());
                    let messageObj = {
                          gameId: war.gameId,
                          username: "Host",
                          message: `${data.userName} started a game of War`,
                          createdAt: new Date()};
                    messages.push(messageObj);
                    io.emit('updateMessages', { data: messages });
                    self.users.setCurrentGame(data.userId, war.gameId); //update user's current game in the db
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
            socket.join(data.gameId);

            let game = runningGames.get(data.gameId),
                player = game.add(data.userName, socket.id),
                obj = {player: player, gameState: game.getState()},
                message = `${player.name} has joined the game`;

            io.emit('joinedGame', message);
            io.to(data.gameId).emit("gameResponse", game.getState() );
            self.users.setCurrentGame(data.userId, data.gameId); //update user's current game in the db
            cb(obj);
        });

        socket.on('gameMessage', function(data) {
          //player is sending data to current game. the game needs to be informed and parse the data

          const newState = runningGames.games[data.gameId].recieveAction(socket.id, data, io);
          io.to(data.gameId).emit("gameResponse", newState);
          io.to(data.gameId).emit('enterRoom');
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
