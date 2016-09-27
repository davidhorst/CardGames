app.factory('socketsFactory', ['$http', '$cookies', '$location', '$routeParams', function($http, $cookies, $location, $routeParams) {

    var socket = io.connect();

    function socketsFactory(){
        var self = this;

        this.createGame = function(gameObj, cb){
          console.log('socketsFactory');
          socket.emit("gameCreate", gameObj, function(returned_data){
            console.log('returned_data at socketsFactory: ', returned_data);
            cb(returned_data);
          });
        };

        // Start Game method

        // Join Game methodd

        // Show Games method (index)
        this.showGames = function(game_name, cb){
          socket.emit("showGames", game_name, function(data){
            console.log("data", data);
            cb(data);
          });
        };

        ////  Socket Responses  ////

        socket.on('returnMessage', function(data) {

        });

   };

   return new socketsFactory();

}]);
