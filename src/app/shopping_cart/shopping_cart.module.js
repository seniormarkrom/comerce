(function(){
    'use strict';

    angular
        .module('test.shoppingCart', [])
        .config(function routeConfig($stateProvider) {
            $stateProvider
                .state('shoppingCart', {
                    url: '/shoppingCart',
                    templateUrl: 'app/shopping_cart/shopping_cart.tpl.html',
                    controller: 'ShoppingCartCtrl',
                    controllerAs: 'cart',
                    resolve:{
                        myCart: function(ShoppingCartSvc){
                            return ShoppingCartSvc.getMyShoppingCart();
                        }
                    }
                });
        });

})();
