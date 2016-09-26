var app = angular.module('app', ['ngRoute','ngCookies' ]);


app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/login.html',
            controller: 'loginController',
        })

        .when('/dashboard', {
            templateUrl: 'partials/dashboard.html',
            controller: 'dashboardController',
        })

        .when('/users/:id', {
            templateUrl: 'partials/user.html',
            controller: 'userController',
        })

        .when('/cardgame/war', {
            templateUrl: 'partials/warGame.html',
            controller: 'warGameController'
        })

        .otherwise({
          redirectTo: '/'
        });
});
