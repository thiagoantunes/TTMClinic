'use strict';

angular.module('ttmclinic')
  .controller('ForgotPasswordController', ForgotPasswordController);

  ForgotPasswordController.$inhect = ['$log', '$state', 'toaster', '$scope'];

  function ForgotPasswordController($log, $state, toaster, $scope) {
    var vm = this;
    vm.forgotPassword = forgotPassword;


    function forgotPassword() {
      firebase.auth().sendPasswordResetEmail(vm.email).then(function(){
       
        $scope.$apply(function(){
          toaster.success({ body: 'Senha enviada para ' + vm.email});
        });
        $state.go('login');
      },function(error) {
        $scope.$apply(function(){
          toaster.pop('error', "Ops!!", error.message);
        });
      });
    }

  }
