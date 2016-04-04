(function() {
    'use strict';

    angular
        .module('test')
        .controller('IndexCtrl', IndexCtrl);

    /** @ngInject */
    function IndexCtrl( ShoppingCartSvc) {
        var vm = this;

        // variables
        vm.awesomeThings = [];
        vm.myCart = null;

        // init
        activate();

        ////////////////////////////////////////////////////

        function activate() {
            vm.myCart = ShoppingCartSvc.getMyShoppingCart();
        }

    }
})();
