app.controller('dashboardController', ['$scope', '$location', 'usersFactory', 'socketsFactory', function($scope, $location, usersFactory, socketsFactory) {

    if(! usersFactory.isLoggedIn()) {
        $location.path("/");
    }

    $scope.user = usersFactory.getCurrentUser();

    $scope.game = { name: null };

    // Launch A Card Game
    $scope.handleLaunchGame = function(game_name) {
      $scope.game.name = game_name;
    };

    // Leave a Card Game
    $scope.leaveGame = function(){
      $scope.game.name = null;
    };

    // Send a message
    $scope.message;
    $scope.sendMessage = function() {
        socketsFactory.sendMessage($scope.message)
        $scope.message;
    };

    // Recieve messages




}]);
