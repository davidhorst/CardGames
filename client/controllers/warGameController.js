app.controller('warGameController', ['$scope', '$location', 'usersFactory', 'warGameFactory', 'socketsFactory', function($scope, $location, usersFactory, warGameFactory, socketsFactory) {

  $scope.user = usersFactory.getCurrentUser();
  $scope.gameState = null;
  $scope.log = [];

  var getGames = function(){
      socketsFactory.showGames('war', function(returned_data){
          $scope.$apply(function(){
            $scope.games = returned_data.data;
          });
      });
  };

  getGames();

  $scope.fullGames = function(prop, val){

    return function(item){
      return item[prop][0] < item[prop][1];
    }
  };

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

  $scope.handleStartGame = function() {
      socketsFactory.startGame( {userName: $scope.user.user_name, gameId:socketsFactory.socket.gameId, startGame: true});
  }

  socketsFactory.socket.on('enterRoom', function() {
      console.log('change room')
       $scope.$apply(function(){
          $location.path('/cardgame/war')
      })
  })

  $scope.handlePlayCard = function() {
      const gameObj =  {userName: $scope.user.user_name, gameId:socketsFactory.socket.gameId, playCard: true};
      socketsFactory.playCard(gameObj)
  }

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


  socketsFactory.socket.on('winningCard', function(boardObj) {
      console.log('boardObj');
      console.log(boardObj);
      console.log(boardObj.player.name);
      $scope.log.push(`${boardObj.player.name} won with: ${boardObj.card.name}`)
  });

  socketsFactory.socket.on('playedCard', function(boardObj) {
      $scope.log.push(`${boardObj.player.name} played ${boardObj.card.name}`)
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
          console.log(gameState)
      }
      else if(gameState.state == 'gameOver') {

      }

  });


}]);
