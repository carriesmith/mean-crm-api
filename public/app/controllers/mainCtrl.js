angular.module('mainCtrl', [])
  .controller('mainController', function($rootScope, $location, Auth){

    var vm = this;

    // get info if a person is logged in
    vm.loggedIn = Auth.isLoggedIn();

    // check to see if a user is logged in on every request
    // $rootScope module used to detect a route change and check 
    // that the user still logged in
    $rootScope.$on('$routeChangeStart', function(){

      vm.loggedIn = Auth.isLoggedIn();

      // get user information on route change
      Auth.getUser()
        .success(function(data){
          vm.user = data;
        });
    }); // close .$on('$routeChangeStart'...

    // function to handle login form
    vm.doLogin = function(){

      // call the Auth.login() function
      Auth.login(vm.loginData.username, vm.loginData.password)
        .success(function(data){

          // if a user successfully logs in, redirect to users page
          $location.path('/users');

        }); // close .success
    }; // close vm.doLogin

    // function to handle logging out
    vm.doLogout = function() {

      Auth.logout();
      // reset all user info
      vm.user = {};
      // redirect to login page
      $location.path('/login')

    };

  }) // close .controller('mainController'