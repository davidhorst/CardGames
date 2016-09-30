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

        // Reusable Methods
            // Games Index
            socket.on("gamesIndex" ,function(cb){
              const gamesArr = runningGames.index();
              cb({ data : gamesArr });
            });

            // Get Current Messages
            socket.on("getMessages", function(cb){
              cb({ data : messages });
            });

            // Add a Message
            socket.on('addMessage', function(msgObj, cb){
              messages.push(msgObj);
              io.emit('updateMessages', { data: messages} )
              cb();
            });

        // Create Game
        socket.on('createGame', function(data, cb){
            // Switch Case for future games addition
            switch(data.gameName) {
                case 'war':
                    let game = new War(guid());
                    break;
            }

            // Add User to game
            game.add(data.userName, data.userId, socket.id);

            // add game to running games
            let gameId = runningGames.add(game),
                gameState = runningGames.games[gameId].getState();

            // join user's socket to game room
            socket.join(gameId);
            io.to(gameId).emit("joinedGame", gameState);
            cb(game.getState());

            // set game ID in user database for error handling
            self.users.setCurrentGame(data.userId, game.gameId);

            // Tell all users to update games scope
            io.emit("updateGames");

            // Create game created message and emit to update messages
            let messageObj = {
              gameId: game.gameId,
              username: "Host",
              message: `${data.userName} started a game of War`,
              createdAt: new Date()};
            messages.push(messageObj);
            io.emit('updateMessages', { data: messages });
        });

        // Join Exisitng Game -- DONE
        socket.on('joinGame', function(data, cb) {
            socket.join(data.gameId);

            let game = runningGames.get(data.gameId),
                player = game.add(data.userName, data.userId, socket.id),
                message = `${player.name} has joined the game`,
                gameState = runningGames.games[game.gameId].getState();

            // join user's socket to game room
            socket.join(game.gameId);
            io.to(game.gameId).emit("joinedGame", gameState);
            cb(game.getState());

            // set game ID in user database for error handling
            self.users.setCurrentGame(data.userId, game.gameId);

            // Tell all users to update games scope
            io.emit("updateGames");

            // Create game created message and emit to update messages
            let messageObj = {
              gameId: game.gameId,
              username: "Host",
              message: message,
              createdAt: new Date()};
            messages.push(messageObj);
            io.emit('updateMessages', { data: messages });

            // ??
            io.emit('joinedGame', message);
            io.to(data.gameId).emit("gameResponse", game.getState() );

            // Update user's currentGame in the database
            self.users.setCurrentGame(data.userId, data.gameId);
        });

        // Start Game
        socket.on('startGame', function(gameObj){
            let game = runningGames.get(gameObj.gameId);
            game.deal();
            game.state = 'playing';
            io.to(gameObj.gameId).emit("updateCurrentGame", game.getState() );
        });

        // Play card
        socket.on('playCard', function (playObj){
            // console.log('play card at socket routes');
            runningGames.games[playObj.gameId].playCard(playObj.playerIdx, io);
        });

        //player is sending data to current game. the game needs to be informed and parse the data
        socket.on('gameMessage', function(data) {

          const newState = runningGames.games[data.gameId].recieveAction(socket.id, data, io);
          io.to(data.gameId).emit("gameResponse", newState);
          io.to(data.gameId).emit('enterRoom');
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
