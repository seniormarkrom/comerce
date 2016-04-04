(function(){
    'use strict';

    angular
        .module('test.store')
        .config(routeConfig);


    function routeConfig($stateProvider) {
        $stateProvider
            .state('store', {
                url: '/store',
                templateUrl: 'app/store/store.tpl.html',
                controller: 'StoreCtrl',
                controllerAs: 'store',
                resolve:{
                    books: function(booksSvc){
                        return booksSvc.getAllBooks();
                    }
                }
            });

    }


})();