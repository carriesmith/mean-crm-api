console.log("app.js");

angular.module('userApp', 
  ['ngAnimate', 
  'app.routes', 
  'authService', 
  'mainCtrl', 
  'userCtrl', 
  'userService'])
  // application configuration to integrate token into requests
  .config(function($httpProvider){

    // HUH WAH ???
    // attach our auth interceptor to the http requests
    $httpProvider.interceptors.push('AuthInterceptor');

  });