console.log("authService.js");

angular.module('authService', [])
  // =============================================
  // auth factory to login and get information
  // inject $http (angular module) for communicating with the API
  // inject $q (angular module) to return promise objects
  // inject AuthToken (another factory!) to manage tokens
  // =============================================
  .factory('Auth', function($http, $q, AuthToken){

    // create auth factory object
    var authFactory = {};

    // handle user login
    authFactory.login = function(username, password){
      // return the promise object and its data
      return $http.post('/api/authenticate',{
        username: username,
        password: password
      })
      .success(function(data){
        AuthToken.setToken(data.token);
        return data;
      }); // close .success

    }; // close authFactory.login

    // handle user logout
    authFactory.logout = function(){
      // clear the token
      AuthToken.setToken();
    }; // close authFactory.logout

    // check whether a user is logged in
    // checks if there is a local token
    authFactory.isLoggedIn = function(){
      if (AuthToken.getToken())
        return true;
      else
        return false;
    }; // close authFactory.isLoggedIn

    // get info from logged in user
    authFactory.getUser = function(){
      if (AuthToken.getToken())
        // whenever the Auth.getUser() call is made
        // information will check if that information is already
        // available in cache, instead of hitting API every time
        return $http.get('/api/me', {cache: true});
      else
        return $q.reject({ message: 'User has no token.' });
    }; // close authFactory.getUser

    // return auth factory object
    return authFactory;

  }) // close .factory('Auth'...
  // =============================================
  // factory for handling tokens
  // inject $window to store token client-side
  // =============================================
  .factory('AuthToken', function($window){

    var authTokenFactory = {};

    // get the token from local storage
    // (check DevTools -> Resources -> Local Storage)
    authTokenFactory.getToken = function(){
      return $window.localStorage.getItem('token');
    };

    // funciton to set token or clear token
    // if a token is passed, set the token
    // if there is no token, clear it from local storage
    authTokenFactory.setToken = function(token){
      if (token)
        $window.localStorage.setItem('token', token);
      else
        $window.localStorage.removeItem('token');
    }; // close authTokenFactory.setToken

    return authTokenFactory;

  }) // close .factory('AuthToken'...
  // =============================================
  // application configuration to integrate
  // token into requests
  // =============================================
  .factory('AuthInterceptor', function($q, AuthToken){

    var interceptorFactory = {};

    // attach the token to every request
    // *** what is going on here ???
    interceptorFactory.request = function(config){
      // grab the token 
      var token = AuthToken.getToken();

      // if the token exists, add it to the header as x-access-token
      if (token)
        config.headers['x-access-token'] = token;

      return config;

    }; // close interceptorFactory.request

    // redirect if a token doesn't authenticate
    interceptorFactory.responseError = function(response){
      // catches backend calls that fail. 
      // In this case our server returns a 403 forbidden response
      // when the token does not validate or does not exist
      if (response.status == 403) {
        // clear any tokens in storage as they did not validate the user
        AuthToken.setToken();
        // redirect to login page
        $location.path('/login'); 
      }

      // return the errors from the server as a promise
      return $q.reject(response);

    }; // close interceptorFactory.responseError

    return interceptorFactory;

  }); // close .factory('AuthInterceptor'...