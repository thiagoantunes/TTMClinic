'use strict';

angular.module('ttmclinic')
  .controller('LoginController', LoginController);

  LoginController.$inhect = ['UserService', '$state', 'Ref', 'toaster', '$scope'];

  function LoginController(UserService, $state, $log, toaster, $scope) {

    var vm = this;
    vm.login = login;

    activate();

    function activate() {
    }

    function login() {
      firebase.auth().signInWithEmailAndPassword(vm.email, vm.password).then(function(){
        $log.debug('You are logged in'); 
        $state.go('index.main')
      },function(error) {
        $scope.$apply(function(){
          toaster.pop('error', "Ops!!", error.message);
        });
      });
    }

  }
