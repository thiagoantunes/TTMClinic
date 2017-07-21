(function () {
  'use strict';

  var configFb = {
    apiKey: "AIzaSyARcPaIYaQGAvVz317-i0wTjaoiXb4ZEp4",
    authDomain: "ttmclinic-d86fa.firebaseapp.com",
    databaseURL: "https://ttmclinic-d86fa.firebaseio.com",
    storageBucket: "ttmclinic-d86fa.appspot.com"
  };

  firebase.initializeApp(configFb);

  angular
    .module('ttmclinic')
    .factory('Ref', Ref)
    .config(Config)
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $state, UserService) {

    firebase.auth().onAuthStateChanged(function (currentUser) {
      if (!currentUser) {
        UserService.currentUser = currentUser;
        $state.go('login');
      }
    });

    $log.debug('runBlock end');
  }

  function Ref() {
    return firebase.database().ref();
  }

  function Config($validatorProvider) {
    $validatorProvider.addMethod('hexcolor', function (value, element) {
      return this.optional(element) || /^^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value);
    }, 'Informe uma cor válida. (ex: #FFFF)');

    $validatorProvider.addMethod('nospace', function (value, element) {
      return this.optional(element) || /^[a-z]*$/.test(value);
    }, 'O login não pode ter espaços, números ou caracteres especiais');
  }

})();
