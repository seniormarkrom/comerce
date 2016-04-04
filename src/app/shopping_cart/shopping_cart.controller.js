(function() {
    'use strict';

    angular
        .module('test.shoppingCart')
        .controller('ShoppingCartCtrl', ShoppingCartCtrl);

    /** @ngInject */
    function ShoppingCartCtrl(myCart, ShoppingCartSvc) {
        var vm = this;

        // variables
        vm.myCart = myCart;
        vm.commercialOffers = null;
        vm.fullPrice = null;
        vm.bestOffer = null;
        vm.finalPrice = null;

        // functions
        vm.addToShoppingCart = addToShoppingCart;
        vm.removeFromShoppingCart = removeFromShoppingCart;
        vm.completelyRemoveFromShoppingCart = completelyRemoveFromShoppingCart;
        vm.updateShoppingCart = updateShoppingCart;

        // init
        activate();
        ////////////////////////////////////////////////////

        function activate() {
            vm.updateShoppingCart();
        }

        // add an item from the cart
        function addToShoppingCart(item){
            ShoppingCartSvc.addToShoppingCart(item);
            vm.updateShoppingCart();
        }

        // remove an item from the cart
        function removeFromShoppingCart(item){
            if(item.quantity > 1){
                ShoppingCartSvc.removeFromShoppingCart(item, 1);
                vm.updateShoppingCart();
            }
        }

        function completelyRemoveFromShoppingCart(item){
            ShoppingCartSvc.removeFromShoppingCart(item);
            _.remove(vm.myCart, item);
            vm.updateShoppingCart();
        }

        // get the commercial offers and calculate the cart total price
        function updateShoppingCart(){
            if(vm.myCart.length > 0) {

                ShoppingCartSvc.getCommercialOffers(vm.myCart).then(function (newOffers) {
                    vm.commercialOffers = newOffers.offers;

                    vm.fullPrice = ShoppingCartSvc.calculateFullPrice(vm.myCart);
                    vm.bestOffer = ShoppingCartSvc.calculateBestOffer(vm.myCart, vm.commercialOffers);
                    if (vm.fullPrice && vm.bestOffer) {
                        vm.finalPrice = vm.fullPrice - vm.bestOffer.calculatedDiscount;
                    }
                });
            }else{
                vm.fullPrice = vm.bestOffer = vm.finalPrice = null;
            }
        }

    }

})();
