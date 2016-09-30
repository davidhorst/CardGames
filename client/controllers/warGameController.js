app.controller('warGameController', ['$scope', '$location', 'usersFactory', 'warGameFactory', 'socketsFactory', function($scope, $location, usersFactory, warGameFactory, socketsFactory) {

  // This Controller is Nested in desktop controller

  // Reusable Methods
    // Games Index - returns minimal details
    var getGames = function(){
      socketsFactory.gamesIndex(function(returned_data){
        $scope.$apply(function(){
          $scope.games = returned_data.data;
        });
      });
    };

    // method for sorting which games are full
    $scope.fullGames = function(prop){
      return function(item){
        return item[prop][0] < item[prop][1];
      }
    };

  //  Set initial scopes
  $scope.user = usersFactory.getCurrentUser();
  $scope.currentGame;
  $scope.gameState = null;
  $scope.log = [];
  // $scope.currentGame = usersFactory.getCurrentGame(user.user_id);
  getGames();

  // Create Game -- DONE
  $scope.handleCreateGame = function() {
      const gameObj = {
              gameName: 'war',
              userName: $scope.user.user_name,
              userId: $scope.user.user_id};

      socketsFactory.createGame(gameObj, function(returned_data){
          $scope.$apply(function(){
              $scope.currentGame = returned_data;
              $scope.state = returned_data.state
          });
          socketsFactory.socket.gameId = returned_data.gameId
      });

      // Set currentGame for user in database
      // usersFactory.setCurrentGame(gameObj);
  };

  // Join Game
  $scope.handleJoinGame = function(gameId){
    // set Game ID in socket
    socketsFactory.socket.gameId = gameId

    let joinObj = {
      userName: $scope.user.user_name,
      userId: $scope.user.user_id,
      gameId: gameId};

    socketsFactory.joinGame(joinObj, function(returned_obj){
        $scope.$apply(function(){
          $scope.currentGame = returned_obj.gameState;
          socketsFactory.socket.gameId = gameId;
        });
    });
  };

  // Start a game
  $scope.handleStartGame = function() {
      let gameObj = {gameId: socketsFactory.socket.gameId}
      socketsFactory.startGame(gameObj);
  };

  // Play a card
  $scope.handlePlayCard = function(index) {
      const playObj =  {
              gameId: $scope.currentGame.gameId,
              playerIdx: index};
      // console.log("played:", index);
      socketsFactory.playCard(playObj);
  }

  // Leave a game
      // $scope.currentGame = null;

  // Close game window
      // $scope.currentGame = null;

  /////////////////////////////
  // Listen for Server Emits //
  /////////////////////////////

  // Reusable Methods
    // If game is created, joined or left, update games scope
    socketsFactory.socket.on('updateGames', function() {
      getGames();
    });

    socketsFactory.socket.on('roundComplete', function(roundMessage){
      $scope.$apply(function(){
          $scope.roundMessage = roundMessage;
      });
      // console.log('round Message: ', roundMessage);
    })

  // Your Game was joined
  socketsFactory.socket.on('joinedGame', function(currentGame) {
      $scope.$apply(function(){
          $scope.currentGame = currentGame;
      });
  });

  // Your Game changed
  socketsFactory.socket.on('updateCurrentGame', function(currentGame) {
      $scope.$apply(function(){
          $scope.currentGame = currentGame;
      });
      // console.log(currentGame);
  });

  // Game started
      // handled with game state emit and $scope.currentGame updateCurrentGame

  // Player left

  // Evaluate Need -- Maybe include in game state
  socketsFactory.socket.on('winningCard', function(boardObj) {
      $scope.$apply(function(){
           $scope.log = [];
          $scope.log.push(`${boardObj.player.name} won with: ${boardObj.card.name}`)
      });
  });

  // War
  socketsFactory.socket.on('warMessage', function(boardObj) {

      let message = 'Players';
      boardObj.forEach(function(obj) {
          message = message + " " + obj.player.name;
      });
      message = message + ' are in a war!';
       $scope.$apply(function(){
          $scope.log.push(message);
      });
  });

  //  Card Played
  socketsFactory.socket.on('playedCard', function(boardObj) {
      $scope.$apply(function(){
          // console.log(boardObj);
          // $scope.log.push(`${boardObj.player.name} played ${boardObj.card.name}`)
    });
  });

  // Evaluate Need - Maybe include info in gameState
  socketsFactory.socket.on('playerLost', function(player) {
      $scope.$apply(function(){
      $scope.log.push(`${player.name} ran out of cards`)
    });
  });

  // Game Over
  socketsFactory.socket.on('playerWon', function(player){
      $scope.$apply(function(){
          $scope.gameMessage(`${player.name} won!`)
      });
      setTimeout(function(){
        $scope.$apply(function(){
            $scope.currentGame = null;
        });
      }, 2000);
  });


  socketsFactory.socket.on('gameResponse', function(gameState) {
      //depending on the state of the program, show the game state differently
      if(gameState.state == 'waiting') {
          $scope.$apply(function(){
              $scope.currentGame = gameState;
              $scope.playersGameId = socketsFactory.socket.gameId;
          });
      }
      else if(gameState.state == 'playing')
      {
        $scope.$apply(function(){
            $scope.currentGame = gameState;
            $scope.playersGameId = socketsFactory.socket.gameId;
        });
      }
      else if(gameState.state == 'gameOver') {

      }

  });


}]);
