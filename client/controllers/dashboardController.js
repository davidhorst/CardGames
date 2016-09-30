app.controller('dashboardController', ['$scope', '$location', 'usersFactory', 'socketsFactory', function($scope, $location, usersFactory, socketsFactory) {
    //  Check User Status
    if(! usersFactory.isLoggedIn()) {
        $location.path("/");
    }

    // Reusable Methods
    var getMessages = function(){
        socketsFactory.getMessages(function(returned_data){
            $scope.$apply(function(){
              $scope.messages = returned_data.data;
            });
        });
    };

    // Initialize scopes
    $scope.user = usersFactory.getCurrentUser();
    $scope.game = { name: null };
    $scope.message;
    getMessages(); // set $scope.messages

    // Send a message
    $scope.newMessage = function() {
      let msgObj = {
        username: $scope.user.user_name,
        message: $scope.message,
        createdAt: new Date()};

      socketsFactory.addMessage(msgObj, function(){
        getMessages();
      })
      $scope.message = null;
    };

    // Launch A Card Game
    $scope.handleLaunchGame = function(game_name) {
      $scope.game.name = game_name;
    };

    // Leave a Card Game
    $scope.leaveGame = function(){
      $scope.game.name = null;
    };

    // Listen for new messages and update scope
    socketsFactory.socket.on('updateMessages', function(returned_data) {
        $scope.$apply(function(){
          $scope.messages = returned_data.data;
        });
    });

}]);
