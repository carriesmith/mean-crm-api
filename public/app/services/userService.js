angular.module('userService', [])
  .factory('User', function($http){
    
    // create a new object
    var userFactory = {};

    // --- Service to return a single user ---
    // Function that will create an HTTP GET /api/users/:user_id call 
    // using $http module and return a promise object.
    // can act on the promise object by accessing success(), error() or then().
    // NOTE: if the API is hosted on another server would need to prefix
    //       these with server URL e.g. 'http://example.com/api/users/'
    userFactory.get = function(id){
      return $http.get('/api/users/' + id);
    };

    // --- Return all users ---
    userFactory.all = function(){
      return $http.get('/api/users');
    };

    // --- Create a user ---
    userFactory.create = function(userData){
      return $http.post('/api/users/', userData);
    };

    // --- Update a user ---
    userFactory.update = function(id, userData){
      return $http.put('/api/users/' + id, userData);
    };

    // --- Delete a user ---
    userFactory.delete = function(id){
      return $http.delete('/api/users/' + id);
    };   

    // return entire userFactory object
    return myFactory;

  }) // close .factory