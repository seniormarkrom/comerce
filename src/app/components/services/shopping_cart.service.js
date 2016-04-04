(function() {
    'use strict';

    angular
        .module('test.components')
        .service('ShoppingCartSvc', ShoppingCartSvc);

    /* @ngInject */
    function ShoppingCartSvc($rootScope, Restangular, localStorageService) {

        var service = {
            getMyShoppingCartLength: getMyShoppingCartLength,
            getMyShoppingCart: getMyShoppingCart,
            addToShoppingCart: addToShoppingCart,
            removeFromShoppingCart: removeFromShoppingCart,
            getCommercialOffers: getCommercialOffers,
            calculateFullPrice: calculateFullPrice,
            calculateBestOffer: calculateBestOffer
        };

        return service;

        /////////////////////////////////////////////////////////////////////////

        // Return the number of items in my cart
        function getMyShoppingCartLength(){
            var myCart = this.getMyShoppingCart(),
                result = 0;
            _.forEach(myCart, function(item){
                result += item.quantity;
            });

            return result;
        }

        // Return my current shopping cart
        function getMyShoppingCart(){
            var booksIds = localStorageService.keys();
            var myCart = [];

            _.forEach(booksIds, function(bookId){
                myCart.push(localStorageService.get(bookId));
            });

            return myCart;
        }

        // Add one quantity of the item to the cart
        function addToShoppingCart(article) {
            var localStorageBook = localStorageService.get(article.isbn);

            if(!localStorageBook){
                article.quantity = 1;
            }else{
                article.quantity = localStorageBook.quantity + 1;
            }

            $rootScope.$broadcast('addItemToCart');
            return localStorageService.set(article.isbn, article);
        }

        // Remove one item from the quantity of the localstorage
        function removeFromShoppingCart(article, quantityToRemove) {
            var localStorageBook = localStorageService.get(article.isbn),
                result = null;

            if(quantityToRemove && angular.isNumber(quantityToRemove)){
                // remove the quantity from the article
                article.quantity = localStorageBook.quantity - quantityToRemove;
                localStorageService.set(article.isbn, article);
                result = localStorageService.get(article.isbn);
            }else{
                // remove the article from the cart
                result = localStorageService.remove(article.isbn);
            }

            $rootScope.$broadcast('removeItemFromCart');
            return result;
        }

        // get All commercial offers associated to the current cart
        function getCommercialOffers(items) {
            var urlToCall = 'http://henri-potier.xebia.fr/books/';

            if(!items || !items.length || items.length === 0){
                return [];
            }else {
                for (var i = 0; i < items.length; i++) {
                    for(var j = 0; j < items[i].quantity; j++) {
                        urlToCall += items[i].isbn;
                        if (i < items.length - 1) {
                            urlToCall += ',';
                        }
                    }
                }
                urlToCall += '/commercialOffers';

                return Restangular.oneUrl('commercialOffers', urlToCall).get();
            }
        }

        // Calculate cart price without any offer
        function calculateFullPrice(items){
            if(items && items.length > 0){

                var fullPrice = 0;

                _.forEach(items, function(item){
                    fullPrice += item.price * item.quantity;
                });

                return fullPrice;
            }else{
                return null;
            }
        }

        // Find the best offer to apply to the cart
        function calculateBestOffer(items, offers) {
            if (items && items.length > 0 && offers && offers.length > 0) {
                var fullPrice = this.calculateFullPrice(items);

                _.forEach(offers, function (offer) {
                    if (offer.type === 'percentage') {
                        offer.calculatedDiscount = fullPrice * (offer.value / 100);
                    } else if (offer.type === 'minus') {
                        offer.calculatedDiscount = offer.value;
                    } else if (offer.type === 'slice') {
                        offer.calculatedDiscount = Math.floor(fullPrice / offer.sliceValue) * offer.value;
                    }
                });

                return _.max(offers, 'calculatedDiscount');
            }else{
                return null;
            }
        }
    }
})();
