console.log("app.routes.js");

angular.module('app.routes', ['ngRoute'])
  .config( function($routeProvider, $locationProvider) {
    $routeProvider
      // home page route
      .when('/', {
        templateUrl:  'app/views/pages/home.html'
      }) // close .when landing

      // login page route
      .when('/login', {
        templateUrl:  'app/views/pages/login.html',
        controller:   'mainController',
        controllerAs: 'login'
      })

      .when('/users', {
        templateUrl:  'app/views/pages/all.html',
        controller:   'userController',
        controllerAs: 'user'
      })

      // create new user route 
      // (form to create new user and update existing share same view)
      .when('/users/create', {
        templateUrl: 'app/views/pages/users/single.html',
        controller:  'userCreateController', 
        controllerAs: 'user'
      })

      // 
      .when('/users/:user_id', {
        templateUrl: 'app/views/pages/users/single.html',
        controller: 'userEditController',
        controllerAs: 'user'
      });

    // get rid of the hash in the URL
    $locationProvider.html5Mode(true);

  }); // close .config