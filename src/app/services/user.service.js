(function () {
  'use strict';
  angular
    .module('ttmclinic')
    .factory('UserService', UserService);

  UserService.$inject = [];

  function UserService() {

    var service = {
      currentUser: null
    };

    return service;


  }

} ());
