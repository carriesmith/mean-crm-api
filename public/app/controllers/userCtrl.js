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

  }); // close .controller('userController'