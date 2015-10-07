angular.module('app.routes', ['ngRoute'])
  .config( function($routeProvider, $locationProvider) {
    $routeProvider
      // home page route
      .when('/', {
        templateUrl: 'app/views/pages/home.html'
      }); // close .when

    // get rid of the hash in the URL
    $locationProvider.html5Mode(true);

  }); // close .config