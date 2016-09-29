var app = angular.module('app', ['ngRoute','ngCookies' ]);

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});


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

        .when('/leaderboard', {
            templateUrl: 'partials/leaderboard.html',
            controller: 'leaderboardController',
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
