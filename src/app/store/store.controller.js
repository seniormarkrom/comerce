(function() {
    'use strict';

    angular
        .module('test.store')
        .controller('StoreCtrl', StoreCtrl);

    /** @ngInject */
    function StoreCtrl(books) {
        var vm = this;

        // variables
        vm.books = books;

        // functions

        // init
        activate();

        ////////////////////////////////////////////////////

        function activate() {

        }
    }
})();
