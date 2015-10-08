console.log("userCtrl.js");

angular.module('userCtrl', ['userService'])
  .controller('userController', function(User){

    var vm = this;

    // set a processing variable to show loading
    vm.processing = true;

    // grab all the users at page load
    Users.all()
      .success(function(data){
        // when all the users come back, remove the processing variable
        vm.processing = false;

        // bind the users that come back to vm.users
        vm.users = data;

      }); // close Users.all().success(...

  }); // close .controller('userController'