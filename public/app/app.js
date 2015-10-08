angular.module('userApp', 
  ['ngAnimate', 
  'app.routes', 
  'authService', 
  'mainCtrl', 
  'userCtrl', 
  'userService'])
// application configuration to integrate token into requests
// HUH WAH ???
.config(function($hhtpProvider){

  // attach our auth interceptor to the http requests
  $httpProvider.interceptor.push('AuthInterceptor');

});