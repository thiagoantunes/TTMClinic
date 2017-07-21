(function () {
  'use strict';
  angular
    .module('ttmclinic')
    .factory('StorageService', StorageService);

  StorageService.$inject = ['$firebaseArray'];

  function StorageService($firebaseArray) {

    var service = {
      //ref: firebase.database().ref().child('clinics'),
      images: $firebaseArray(firebase.database().ref().child('storage/images')),
      videos: $firebaseArray(firebase.database().ref().child('storage/videos'))
    };

    return service;

  }

}());
