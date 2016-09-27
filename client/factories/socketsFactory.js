app.factory('socketsFactory', ['$http', '$cookies', '$location', '$routeParams', function($http, $cookies, $location, $routeParams) {

    var socket = io.connect();

    function socketsFactory(){
        var self = this;

        this.createGame = function(gameObj, cb){
          socket.emit("gameCreate", gameObj);
        };

        // Start Game method

        // Join Game method

        // Show Games method (index)

        ////  Socket Responses  ////
        socket.on('gameCreated', function(data) {
          $scope.gameState = data;
          $scope.$digest();
        });

        socket.on('returnMessage', function(data) {
          console.log(data);
          $scope.gameReply = data;
          $scope.$digest();
        });

   };

    return new socketsFactory();
}]);
