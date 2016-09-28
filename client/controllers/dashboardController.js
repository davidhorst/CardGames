app.controller('dashboardController', ['$scope', '$location', 'usersFactory', 'socketsFactory', function($scope, $location, usersFactory, socketsFactory) {

    if(! usersFactory.isLoggedIn()) {
        $location.path("/");
    }

    $scope.user = usersFactory.getCurrentUser();

    $scope.game = { name: null };

    $scope.handleLaunchGame = function(game_name) {
      $scope.game.name = game_name;
    };

    $scope.leaveGame = function(){
      $scope.game.name = null;
    };

    //// Socket Responses  ////


        //do any pre game checks
        //add any data to user about joining game


}]);
