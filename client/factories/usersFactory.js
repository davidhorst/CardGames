app.factory('usersFactory', ['$http', '$cookies', '$location', '$routeParams', function($http, $cookies, $location, $routeParams) {

    function usersFactory(){
        var self = this;

        this.login = function(loginData) {
            return $http.post('/users/login', loginData)
            .then(function(returned_data) {
                return returned_data.data;})
            .catch(function() {
                throw new Error('server could not log you in')
            });
        };

        this.logout = function() {
             $cookies.remove('token');
             $cookies.remove('current_user')
             $location.path("/");
        };

        this.register = function(regiserData) {
            return $http.post('/users', regiserData)
            .then(function(returned_data) {
                return returned_data.data })
            .catch(function(returned_data) {
                throw returned_data.data
            });
        };

        this.isLoggedIn = function() {
            return !!self.getCurrentUser();
        };

        this.getCurrentUser = function() {
            return $cookies.getObject('current_user');
        }

        this.getCurrentGame = function(userId){
          return $http.get(`/user/game/${userId}`)
          .then(function(returned_data){
            return returned_data.data;
          })
        };

        this.show = function() {
            return $http.get(`/users/${$routeParams.id}`)
            .then(function(returned_data) {
                console.log(returned_data);
                return returned_data.data;
            })
            .catch(function(returned_data) {
                throw returned_data.data;
            });
        }
        //
        // this.setCurrentGame = function(gameObj){
        //   return $http.get(`/users/addGame/${gameObj.userId}`)
        // }
    };

    return new usersFactory();
}]);
