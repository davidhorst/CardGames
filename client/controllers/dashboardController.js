app.controller('dashboardController', ['$scope', '$location', 'usersFactory',  function($scope, $location, usersFactory) {

    var socket = io.connect();


    if(! usersFactory.isLoggedIn()) {
        $location.path("/");
    }

    $scope.user = usersFactory.getCurrentUser();



    $scope.gameState = 'test';

    $scope.handleJoinGame = function() {
        console.log('click')
        socket.emit("gameCreate", {'gameName': 'war'});
    };

    socket.on('gameJoined', function(data) {
        console.log(data);
        $scope.gameState = data;
        $scope.$digest();
    });
        //do any pre game checks
        //add any data to user about joining game


}]);
