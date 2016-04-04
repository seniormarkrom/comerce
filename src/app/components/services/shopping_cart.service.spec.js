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
        ];
    };
    var getMockOffers = function(percentageValue, minusValue, sliceSliceValue, sliceValue){
        return [
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
    var getBook = function(id, quantity){
        return {
            "isbn": id,
            "title": "Henri Potier à l'école des sorciers",
            "price": 35,
            "cover": "http://henri-potier.xebia.fr/hp0.jpg",
            "quantity": quantity
        }
    };

    var ShoppingCartSvc;
    var mockRestangular = jasmine.createSpyObj('Restangular', ['oneUrl', 'get']);
    mockRestangular.oneUrl.and.returnValue(mockRestangular);
    mockRestangular.get.and.returnValue(true);


    var mockLocalStorageService = jasmine.createSpyObj('mockLocalStorageService', ['get', 'set', 'keys', 'length']);
    mockLocalStorageService.keys.and.returnValue(['isbn1', 'isbn2']);
    mockLocalStorageService.get = function(id){
        return getBook(id);
    };
    mockLocalStorageService.set = function(id, book){
      return book;
    };

    describe('Books service', function(){

        beforeEach(module('test.components'));
        beforeEach(function(){
            angular.mock.module('test.components', function($provide){
                $provide.value('Restangular', mockRestangular);
                $provide.value('localStorageService', mockLocalStorageService);
            });
            angular.mock.inject(function($injector){
                ShoppingCartSvc = $injector.get('ShoppingCartSvc');
            });
        });


        it('Should return my shopping cart size', function() {
            // mocking the function called in "getMyShoppingCartLength" to retrieve the cart
            ShoppingCartSvc.getMyShoppingCart = function(){
                return getMockBooks(2,3);
            };
            expect(ShoppingCartSvc.getMyShoppingCartLength()).toEqual(5);
        });


        it('Should return my shopping cart stored in local storage', function() {
            var resultExpected = [];
            resultExpected.push(getBook('isbn1'));
            resultExpected.push(getBook('isbn2'));

            expect(ShoppingCartSvc.getMyShoppingCart()).toEqual(resultExpected);
        });

        describe('Related to Adding an item to my shopping cart', function() {
            it('Should add one quantity to the item', function() {
                //mocking the fact that I have the book in the cart
                mockLocalStorageService.get = function(id){
                    return getBook(id, 1);
                };
                expect(ShoppingCartSvc.addToShoppingCart(getBook('id',1))).toEqual(getBook('id',2));
            });

            it('Should add a new item in the shopping cart with 1 quantity', function() {
                //mocking the fact that I don't have the book in the cart yet
                mockLocalStorageService.get = function(){
                    return null
                };
                expect(ShoppingCartSvc.addToShoppingCart(getBook('id',1))).toEqual(getBook('id',1));
            });

        });


        describe('Related to the commercial offers', function() {
            it('Should return no offers', function() {
                var wrongOffers = [[], null, undefined];
                angular.forEach(wrongOffers, function(wrongOffer){
                    expect(ShoppingCartSvc.getCommercialOffers(wrongOffer)).toEqual([]);
                });
            });

            it('Should call the right url', function() {
                ShoppingCartSvc.getCommercialOffers(getMockBooks(1,1));
                var urlToCall = 'http://henri-potier.xebia.fr/books/c8fabf68-8374-48fe-a7ea-a00ccd07afff,a460afed-e5e7-4e39-a39d-c885c05db861/commercialOffers';
                expect(mockRestangular.oneUrl).toHaveBeenCalledWith('commercialOffers', urlToCall);
            });

            it('Should add isbn to the url according the quandity of the same book', function() {
                ShoppingCartSvc.getCommercialOffers(getMockBooks(2,1));
                var urlToCall = 'http://henri-potier.xebia.fr/books/c8fabf68-8374-48fe-a7ea-a00ccd07afff,c8fabf68-8374-48fe-a7ea-a00ccd07afff,a460afed-e5e7-4e39-a39d-c885c05db861/commercialOffers';
                expect(mockRestangular.oneUrl).toHaveBeenCalledWith('commercialOffers', urlToCall);
            });

        });


        describe('Related to the full price of the cart', function() {

            it('Should return null', function() {
                var wrongCart = [[], null, undefined];
                angular.forEach(wrongCart, function(wrongCart){
                    expect(ShoppingCartSvc.calculateFullPrice(wrongCart)).toBeNull();
                });
            });

            it('Should return the total of the cart', function() {
                var books = getMockBooks(2, 3);
                expect(ShoppingCartSvc.calculateFullPrice(books)).toEqual(160);
            });

        });

        describe('Related to the best offer', function(){

            it('Should return null', function() {
                var differentItems = [[], null, undefined],
                    differentOffers = [[], null, undefined];

                angular.forEach(differentItems, function(items){
                    angular.forEach(differentOffers, function(offers){
                        expect(ShoppingCartSvc.calculateBestOffer(items, offers)).toBeNull();
                    });
                });

            });

            it('Should return the percentage offer', function() {
                var offers = getMockOffers(50,15,100,12),
                    books = getMockBooks(1,1);

                expect(ShoppingCartSvc.calculateBestOffer(books, offers)).toEqual({
                    "type": "percentage",
                    "value": 50,
                    "calculatedDiscount": 32.5
                });
            });

            it('Should return the minus offer', function() {
                var offers = getMockOffers(5,15,100,12),
                    books = getMockBooks(1,1);

                expect(ShoppingCartSvc.calculateBestOffer(books, offers)).toEqual({
                    "type": "minus",
                    "value": 15,
                    "calculatedDiscount": 15
                });
            });

            it('Should return the slice offer', function() {
                var offers = getMockOffers(5,30,100,15),
                    books = getMockBooks(6,4);

                expect(ShoppingCartSvc.calculateBestOffer(books, offers)).toEqual({
                    "type": "slice",
                    "sliceValue": 100,
                    "value": 15,
                    "calculatedDiscount": 45
                });
            });

        });

    });
})();
