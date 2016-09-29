app.factory('socketsFactory', ['$http', '$cookies', '$location', '$routeParams', function($http, $cookies, $location, $routeParams) {

    var socket = io.connect();

    function socketsFactory(){
        var self = this;
        self.socket = socket;


        this.createGame = function(gameObj, cb){
          socket.emit("gameCreate", gameObj, function(returned_data){
            // returned_data = war.gameState()
            cb(returned_data);
          });
        };

        // Start Game method
        this.startGame = function(gameObj) {
            socket.emit("gameMessage", gameObj);
        }

        // Join Game methodd
        this.joinGame = function(joinObj, cb){
            socket.emit("joinGame", joinObj, function(obj){
            cb(obj);
          });
        };
        // Show Games method (index)
        this.showGames = function(game_name, cb){
          socket.emit("showGames", game_name, function(data){
            cb(data);
          });
        };


        // Return Current messages
        this.getMessages = function(cb){
          socket.emit("getMessages", function(data){
            cb(data);
          });
        };

        //causes all connected users to get game state
        this.getGameState = function(game_name) {
            socket.emit("gameMessage", game_name);
        };


        ////  Socket Responses  ////

        this.addMessage = function(msgObj, cb){
          socket.emit('addMessage', msgObj ,function(){
            cb();
          });
        };

   };

   return new socketsFactory();

}]);
