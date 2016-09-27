app.controller('dashboardController', ['$scope', '$location', 'usersFactory',  function($scope, $location, usersFactory) {

    var socket = io.connect();


    if(! usersFactory.isLoggedIn()) {
        $location.path("/");
    }

    $scope.user = usersFactory.getCurrentUser();



    $scope.gameState;

    $scope.handleJoinGame = function() {
        socket.emit("gameJoin", {'game_id': '12345'});
    };

    $scope.leaveGame = function(){
        $scope.gameState = null;
    };

    socket.on('gameJoined', function(data) {
        console.log(data);
        $scope.gameState = data;
        $scope.$digest();
    });
        //do any pre game checks
        //add any data to user about joining game


}]);
