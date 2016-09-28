app.controller('warGameController', ['$scope', '$location', 'usersFactory', 'warGameFactory', 'socketsFactory', function($scope, $location, usersFactory, warGameFactory, socketsFactory) {

  $scope.user = usersFactory.getCurrentUser();
  $scope.gameState = null;
  var tempGames;
  var getGames = function(){
      socketsFactory.showGames('war', function(returned_data){
        //   console.log('controller callback');

          tempGames = returned_data;
        //   console.log(tempGames);
          $scope.$apply(function(){
            $scope.games = tempGames.data;
          });
      });
  };

  getGames();

  // Create Game
  $scope.handleCreateGame = function() {
      const gameObj = {'gameName': 'war', 'userName':  $scope.user.user_name};
      socketsFactory.createGame(gameObj, function(returned_data){
        $scope.currentGame = returned_data;
         $scope.$apply(function(){
             socketsFactory.socket.gameId = returned_data.gameId
         });
        getGames();
        $scope.state = returned_data.state
         $scope.$digest();
      });
  };

  // Join Game
  $scope.handleJoinGame = function(game){
      console.log('join game')

    $scope.games.forEach(function(game){
        console.log(game.capacity)

      if (game.capacity[0] != game.capacity[1]) {
        joinObj = { userName: $scope.user.user_name, gameId: game.gameId }
        $scope.$apply(function(){
            socketsFactory.socket.gameId = returned_data.gameId
            socketsFactory.joinGame(joinObj, function(returned_obj){
              $scope.currentGame = returned_obj.gameState;
              socketsFactory.socket.gameId = game.gameId
              getGames();
               $scope.state = game.state
           });

        });
      };
    });
  };

// socket.on Responses

  socketsFactory.socket.on('gameResponse', function(gameState) {
      //depending on the state of the program, show the game state differently

      if(gameState.state == 'waiting') {
          $scope.$apply(function(){
              $scope.state = gameState.state
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
