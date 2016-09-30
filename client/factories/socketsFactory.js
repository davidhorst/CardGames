app.factory('socketsFactory', ['$http', '$cookies', '$location', '$routeParams', function($http, $cookies, $location, $routeParams) {

    var socket = io.connect();

    function socketsFactory(){
        var self = this;
        self.socket = socket;

        // Reusable Methods
          // Get Current Games
          this.gamesIndex = function(cb){
            socket.emit("gamesIndex", function(data){
              cb(data);
            });
          };

          // Get Current Messages
          this.getMessages = function(cb){
            socket.emit("getMessages", function(data){
              cb(data);
            });
          };

          // Get gameState of Your currrentGame
          this.getGameState = function(gameId) {
            socket.emit("getGameState", gameId);
          };

          // Add a message
          this.addMessage = function(msgObj, cb){
            socket.emit('addMessage', msgObj ,function(){
              cb();
            });
          };

        // Create Game
        this.createGame = function(gameObj, cb){
          socket.emit("createGame", gameObj, function(returned_data){
            // returned_data = war.gameState()
            cb(returned_data);
          });
        };

        // Join Game
        this.joinGame = function(joinObj, cb){
          socket.emit("joinGame", joinObj, function(obj){
            cb(obj);
          });
        };

        // Start Game
        this.startGame = function(gameObj) {
          socket.emit("startGame", gameObj);
        }

        // Play Card
        this.playCard = function(playObj) {
           socket.emit("playCard", playObj);
        }

   };

   return new socketsFactory();

}]);
