(function() {
    'use strict';

    var getMockBooks = function(quantityBook1, quantityBook2){
        return [
            {
                "isbn": "c8fabf68-8374-48fe-a7ea-a00ccd07afff",
                "title": "Henri Potier à l'école des sorciers",
                "price": 35,
                "cover": "http://henri-potier.xebia.fr/hp0.jpg",
                "quantity": quantityBook1
            },
            {
                "isbn": "a460afed-e5e7-4e39-a39d-c885c05db861",
                "title": "Henri Potier et la Chambre des secrets",
                "price": 30,
                "cover": "http://henri-potier.xebia.fr/hp1.jpg",
                "quantity": quantityBook2
            }
        ]
    };
    var getMockOffers = function(percentageValue, minusValue, sliceSliceValue, sliceValue){
        return {
            offers: [
                {
                    "type": "percentage",
                    "value": percentageValue
                },
                {
                    "type": "minus",
                    "value": minusValue
                },
                {
                    "type": "slice",
                    "sliceValue": sliceSliceValue,
                    "value": sliceValue
                }
            ]
        };
    };

    var vm,
        commercialOffers = getMockOffers(10, 5, 100, 80),
        mockBestOffer = {type: 'mockOffer', calculatedDiscount: 30};

    var mockShoppingCartSvc = jasmine.createSpyObj('mockShoppingCartSvc', ['addToShoppingCart', 'removeFromShoppingCart', 'getCommercialOffers', 'calculateFullPrice', 'calculateBestOffer']);
    mockShoppingCartSvc.getCommercialOffers.and.returnValue({
        then: function(fn){
            return fn.call(this, commercialOffers);
        }
    });
    mockShoppingCartSvc.calculateFullPrice.and.returnValue(100);
    mockShoppingCartSvc.calculateBestOffer.and.returnValue(mockBestOffer);



    describe('Shopping Cart Controller', function(){

        beforeEach(module('ui.router'));
        beforeEach(module('test.shoppingCart'));
        beforeEach(inject(function($controller){
            vm = $controller('ShoppingCartCtrl', {
                myCart: getMockBooks(1,1),
                commercialOffers: getMockOffers(4,20,80,14),
                ShoppingCartSvc: mockShoppingCartSvc
            });
        }));

        it('Scope should be initialized', function(){
            expect(vm.myCart).toEqual(getMockBooks(1,1));
            expect(vm.commercialOffers).toEqual(commercialOffers.offers);
            expect(vm.fullPrice).toBeDefined();
            expect(vm.bestOffer).toBeDefined();
            expect(vm.finalPrice).toBeDefined();
        });

        describe('Related to the shopping cart update', function() {
            it('Should reset variables if cart empty', function() {
                vm.myCart = [];
                vm.updateShoppingCart();

                expect(vm.fullPrice).toBeNull();
                expect(vm.bestOffer).toBeNull();
                expect(vm.finalPrice).toBeNull();
            });


            describe('Updating the cart', function() {
                beforeEach(function(){
                    vm.updateShoppingCart();
                });

                it('Should update commercial offers', function() {
                    expect(mockShoppingCartSvc.getCommercialOffers).toHaveBeenCalled();
                    expect(vm.commercialOffers).toEqual(commercialOffers.offers);
                });

                it('Should update prices', function() {
                    expect(mockShoppingCartSvc.calculateFullPrice).toHaveBeenCalled();
                    expect(vm.fullPrice).toEqual(100);

                    expect(mockShoppingCartSvc.calculateBestOffer).toHaveBeenCalled();
                    expect(vm.bestOffer).toEqual(mockBestOffer);

                    // final price = 100 - 30
                    expect(vm.finalPrice).toEqual(70);
                });

            });

        });

        describe('Other functions', function(){
            var mockBook;

            beforeEach(function(){
                spyOn(vm, 'updateShoppingCart').and.callThrough();
                mockBook = {
                    "isbn": "c8fabf68-8374-48fe-a7ea-a00ccd07afff",
                    "title": "Henri Potier à l'école des sorciers",
                    "price": 35,
                    "cover": "http://henri-potier.xebia.fr/hp0.jpg",
                    "quantity": 5
                };
                vm.myCart.push(mockBook);
            });

            it('Should add an item to the shopping cart and update the page', function() {
                vm.addToShoppingCart(mockBook);
                expect(mockShoppingCartSvc.addToShoppingCart).toHaveBeenCalledWith(mockBook);
                expect(vm.updateShoppingCart).toHaveBeenCalled();
            });

            describe('Remove one quantity of the item', function() {
                it('Should do nothing if quantity is 1', function() {
                    mockBook.quantity = 1;
                    vm.removeFromShoppingCart(mockBook);
                    expect(mockShoppingCartSvc.removeFromShoppingCart).not.toHaveBeenCalled();
                    expect(vm.updateShoppingCart).not.toHaveBeenCalled();
                });

                it('Should remove one quantity of the item and update the page', function() {
                    vm.removeFromShoppingCart(mockBook);
                    expect(mockShoppingCartSvc.removeFromShoppingCart).toHaveBeenCalledWith(mockBook, 1);
                    expect(vm.updateShoppingCart).toHaveBeenCalled();
                });
            });

            it('Should completely remove the item from the cart', function() {
                vm.completelyRemoveFromShoppingCart(mockBook);
                expect(mockShoppingCartSvc.removeFromShoppingCart).toHaveBeenCalledWith(mockBook);
                expect(_.find(vm.myCart, mockBook)).toBeUndefined();
            });

        });

    });
})();
