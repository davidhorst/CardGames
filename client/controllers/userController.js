app.controller('userController', ['$scope', '$location', 'usersFactory',  function($scope, $location, usersFactory) {

    usersFactory.show()
    .then(function(returned_data) {
        $scope.user = returned_data;
    })
    .catch(function(returned_data) {
        $scope.errors = returned_data;
    });

}]);
