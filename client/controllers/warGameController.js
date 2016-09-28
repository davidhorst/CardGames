app.controller('warGameController', ['$scope', '$location', 'usersFactory', 'warGameFactory', 'socketsFactory', function($scope, $location, usersFactory, warGameFactory, socketsFactory) {

  $scope.user = usersFactory.getCurrentUser();
  $scope.gameState = null;
  var tempGames;
  var getGames = function(){
      socketsFactory.showGames('war', function(returned_data){
          console.log('controller callback');

          tempGames = returned_data;
          console.log(tempGames);
          $scope.$apply(function(){
            $scope.games = tempGames.data;
          });
      });
  };

  getGames();


  socketsFactory.socket.on('test', function(data) {
      // console.log(data);
  });

  // Create Game
  $scope.handleCreateGame = function() {
      const gameObj = {'gameName': 'war', 'userName':  $scope.user.user_name};
      socketsFactory.createGame(gameObj, function(returned_data){
        $scope.currentGame = returned_data;
        getGames();
      });
  };

  // Join Game
  $scope.handleJoinGame = function(){
    $scope.games.forEach(function(game){
      if (game.capacity[0] != game.capacity[1]) {
        joinObj = { userName: $scope.user.user_name, gameId: game.gameId }
        socketsFactory.joinGame(joinObj, function(returned_obj){
          $scope.currentGame = returned_obj.gameState;
          getGames();
        });
      };
    });
  };

// socket.on Responses

  // socketsFactory.socket.on('gameResponse', function(gameState) {
  //     if(gameState.state)
  //     $scope.currentPlayer = gameState.
  // });





}]);
