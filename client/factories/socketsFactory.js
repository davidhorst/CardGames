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

    
        ////  Socket Responses  ////


   };

   return new socketsFactory();

}]);
