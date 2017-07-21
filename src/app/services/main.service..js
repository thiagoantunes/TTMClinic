(function () {
  'use strict';
  angular
    .module('ttmclinic')
    .factory('MainService', MainService);

  MainService.$inject = ['$firebaseObject', '$firebaseArray'];

  function MainService($firebaseObject, $firebaseArray) {

    var service = {
      //ref: firebase.database().ref().child('clinics'),
      clinics: $firebaseArray(firebase.database().ref().child('clinics')),
      getCategories: getCategories,
      getBanners: getBanners,
      getItem: getItem
    };

    return service;

    // function get(id) {
    //   return $firebaseObject(service.ref.child(id));
    // }

    function getCategories(clinicId) {
      return $firebaseArray(firebase.database().ref().child('categories').child(clinicId));
    }

    function getBanners(clinicId) {
      return $firebaseArray(firebase.database().ref().child('banners').child(clinicId));
    }

    function getItem(clinicId, categoryId, itemId) {
      return $firebaseObject(firebase.database().ref().child('categories/' + clinicId + '/' + categoryId + '/items/' + itemId));
    }

    // function editarJogo(data) {
    //   var deferred = $q.defer();
    //   var jogoData = {};
    //   jogoData['jogos/' + data.idPartida] = data.partida;

    //   firebase.database().ref().update(jogoData, function () {
    //   });

    //   return deferred.promise;
    // }


  }

}());
