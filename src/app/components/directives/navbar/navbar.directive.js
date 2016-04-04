(function(){
    'use strict';

    angular
        .module('test.components')
        .directive('bookstoreNavbar', bookstoreNavbar);

    function bookstoreNavbar(ShoppingCartSvc, $rootScope) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/components/directives/navbar/navbar.tpl.html',
            controller: NavbarController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        /** @ngInject */
        function NavbarController() {
            var vm = this;

            vm.shoppingCartLength = ShoppingCartSvc.getMyShoppingCartLength();

            $rootScope.$on('addItemToCart', function(){
                vm.shoppingCartLength ++;
            });

            $rootScope.$on('removeItemFromCart', function(){
                vm.shoppingCartLength --;
            });

        }
    }

})();
