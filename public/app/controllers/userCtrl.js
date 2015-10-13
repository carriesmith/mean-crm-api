console.log("userCtrl.js");

angular.module('userCtrl', ['userService'])
  .controller('userController', function(User){

    var vm = this;

    // set a processing variable to show loading
    vm.processing = true;

    // grab all the users at page load
    // User refers to factory('User' -> userService.js
    User.all()
      .success(function(data){
        // when all the users come back, remove the processing variable
        vm.processing = false;

        // bind the users that come back to vm.users
        vm.users = data;

      }); // close Users.all().success(...

    vm.deleteUser = function(id){
      vm.processing = true;

      // accept the user id as a parameter
      User.delete(id)
        .success(function(data){

          // get all users to update the table
          // (could also set up the api
          // to return the list of users with the delete call)

          User.all()
            .success(function(data){
              vm.processing = false;
              vm.users = data;
            }); // close User.all().success(...

        }); // close User.delete(id).success(...

    }; // close  vm.deleteUser = function(id)

  }) // close .controller('userController'
  .controller('userCreateController', function(User){
    
    var vm = this;

    // variable to hide/show elements of the view to differentiate
    // between create or edit pages
    vm.type = 'create';

    // function to create a user
    vm.saveUser = function(){

      vm.processing = true;

      // clear messages
      vm.message = '';

      // use the create function in the userService
      User.create(vm.userData)
        .success(function(data){

          vm.process = false;

          // clear the form
          vm.userData = {};
          vm.message = data.message;
          console.log("user created message " + vm.message);
          console.log(data);

        }); // close .success

    }; // close vm.saveUser = function(){

  })
  // controller applied to user edit page
  .controller('userEditController', function($routeParams, User){

    var vm = this;

    // variable to hide/show elements of the view to differentiate
    // between create or edit pages

    vm.type = 'edit';

    // get the user data for the user you want to edit
    // $routeParams is the way to grab data from the URL
    User.get($routeParams.user_id)
      .success(function(data){
        vm.userData = data;
      });

    // function to save the user
    vm.saveUser = function(){
      vm.processing = true;
      vm.message = '';

      // call the userService function to update
      User.update($routeParams.user_id, vm.userData)
        .success(function(data){

          vm.processing = false;

          // Don't reset form or you forget who you are working on.
          // vm.userData = {};

          // bind the message from our API to vm.message
          vm.message = data.message;

        }); // end User.update(...).success
    }; // end vm.saveUser

  });