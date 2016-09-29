app.controller('warGameController', ['$scope', '$location', 'usersFactory', 'warGameFactory', 'socketsFactory', function($scope, $location, usersFactory, warGameFactory, socketsFactory) {

  $scope.user = usersFactory.getCurrentUser();
  $scope.gameState = null;

  var getGames = function(){
      socketsFactory.showGames('war', function(returned_data){
          $scope.$apply(function(){
            $scope.games = returned_data.data;
          });
      });
  };

  getGames();

  // Create Game
  $scope.handleCreateGame = function() {
      const gameObj = {'gameName': 'war', 'userName':  $scope.user.user_name};
      socketsFactory.createGame(gameObj, function(returned_data){
          $scope.$apply(function(){
              $scope.currentGame = returned_data;
              $scope.state = returned_data.state
          });
          socketsFactory.socket.gameId = returned_data.gameId
        getGames();
      });
  };

  // Join Game
  $scope.handleJoinGame = function(gameId){
      joinObj = { userName: $scope.user.user_name, gameId: gameId }
      socketsFactory.socket.gameId = gameId
      socketsFactory.joinGame(joinObj, function(returned_obj){
          getGames();
          $scope.$apply(function(){
              $scope.currentGame = returned_obj.gameState;
              socketsFactory.socket.gameId = gameId
              // $scope.state = game.state
          });
      });
  };

  // socket.on Responses
 socketsFactory.socket.on('updateGames', function() {
     getGames();
 });

  socketsFactory.socket.on('gameResponse', function(gameState) {
      //depending on the state of the program, show the game state differently

      if(gameState.state == 'waiting') {
          $scope.$apply(function(){
              $scope.state = gameState.state;
              $scope.playersGameId = socketsFactory.socket.gameId;

          });
      }
      else if(gameState.state == 'playing')
      {
          $scope.$apply(function(){
              $scope.state =[]
              $scope.playersGameId = []

          });
      }

      else if(gameState.state == 'gameOver') {

      }

  });
}]);
