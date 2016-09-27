app.controller('warGameController', ['$scope', '$location', 'usersFactory', 'warGameFactory',  function($scope, $location, usersFactory, warGameFactory) {

  $scope.user = usersFactory.getCurrentUser();

  var getGames = function(){
    socketsFactory.show('war', function(returned_data){
        $scope.games = returned_data;
        console.log('games:', $scope.games);
    });
  };

  getGames();
  // Create Game
  $scope.handleCreateGame = function() {
      const gameObj = {'gameName': 'war', 'userName':  $scope.user.user_name};
      socketsFactory.createGame(gameObj, function(data){
        $scope.gameState = data;
        $scope.$digest();
      });
  };

  // Join Game
  $scope.handleJoinGame = function(){

  };


}]);
