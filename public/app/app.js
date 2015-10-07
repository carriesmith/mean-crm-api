console.log("app.js loaded");

angular.module('userApp', 
  ['ngAnimate', // add animations to angular directives (ngShow / ngHide)
  'app.routes', // routing for application
  'authService', // authentification service file
  'mainCtrl',    // controller encompassing main view
  'userCtrl',    // controller for user management pages
  'userService'  // user services file
  ]);