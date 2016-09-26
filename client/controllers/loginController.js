app.controller('loginController', ['$scope', '$location', 'usersFactory',  function($scope, $location, usersFactory) {
    $scope.reg_errors = {};

    $scope.handleLogoutClick = function() {
        usersFactory.logout();
    }

    $scope.handleLoginClick = function() {
        usersFactory.login($scope.user)
        .then(function(returned_data) {
            if(! returned_data.errors) {
                $location.path("/dashboard");

            } else {
                $scope.errors = returned_data.errors;
            }
        })
        .catch(function(err) {
            $scope.errors = err;
        });
    }

    $scope.handelRegisterClick = function() {
        if($scope.reg_user.password != $scope.reg_user.conf_password) {
            $scope.reg_errors.password_match =  {message: "Passwords must match"};
        } else {
            usersFactory.register($scope.reg_user)
            .then(function() {
                $location.path("/dashboard");
            })
            .catch(function(returned_data) {
                $scope.reg_errors = returned_data.err.errors;
            });
        }
    };

}]);
