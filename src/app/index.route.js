(function() {
  'use strict';

  angular
    .module('ttmclinic')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: "/login",
        templateUrl: "app/login/login.html",
        controller:"LoginController as vm",
        data: { pageTitle: 'Login', specialClass: 'gray-bg' }
      })
      .state('forgot_password', {
        url: "/forgot_password",
        templateUrl: "app/login/forgot_password.html",
        controller:"ForgotPasswordController as vm",
        data: { pageTitle: 'Forgot password', specialClass: 'gray-bg' }
      })
      .state('index', {
        abstract: true,
        url: "/index",
        templateUrl: "app/components/common/content.html"
      })
      .state('index.main', {
        url: "/main",
        templateUrl: "app/main/main.html",
        data: { pageTitle: 'Example view' }
      })
      .state('index.categories', {
        url: "/categories/:id",
        templateUrl: "app/categories/categories.html",
        controller:"CategoriesController as vm",
        data: { pageTitle: 'Categorias' }
      })
      .state('index.minor', {
        url: "/minor",
        templateUrl: "app/minor/minor.html",
        data: { pageTitle: 'Example view' }
      });

    $urlRouterProvider.otherwise('/index/main'); 
  }

})();
