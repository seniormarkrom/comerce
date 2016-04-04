(function() {
  'use strict';

  angular
    .module('test', [
      'ngAnimate',
      'ngCookies',
      'ngTouch',
      'ngSanitize',
      'restangular',
      'ui.router',
      'ngMaterial',
      'LocalStorageModule',
      'test.store',
      'test.shoppingCart',
      'test.components'
    ])
    .config(function($logProvider, toastr, $urlRouterProvider, localStorageServiceProvider) {
      // Enable log
      $logProvider.debugEnabled(true);

      // Set options third-party lib
      toastr.options.timeOut = 3000;
      toastr.options.positionClass = 'toast-bottom-center';
      toastr.options.preventDuplicates = true;
      toastr.options.progressBar = true;

      // If url not known, redirect to store page
      $urlRouterProvider.otherwise('/store');

      // Local storage config
      localStorageServiceProvider.setPrefix('test');
      localStorageServiceProvider.setStorageType('localStorage');
      localStorageServiceProvider.setNotify(false, false);
    });

})();
