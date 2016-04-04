(function() {
    'use strict';

    var booksSvc,
        henriPotierBooks = [
        {
            "isbn": "c8fabf68-8374-48fe-a7ea-a00ccd07afff",
            "title": "Henri Potier à l'école des sorciers",
            "price": 35,
            "cover": "http://henri-potier.xebia.fr/hp0.jpg"
        },
        {
            "isbn": "a460afed-e5e7-4e39-a39d-c885c05db861",
            "title": "Henri Potier et la Chambre des secrets",
            "price": 30,
            "cover": "http://henri-potier.xebia.fr/hp1.jpg"
        },
        {
            "isbn": "fcd1e6fa-a63f-4f75-9da4-b560020b6acc",
            "title": "Henri Potier et le Prisonnier d'Azkaban",
            "price": 30,
            "cover": "http://henri-potier.xebia.fr/hp2.jpg"
        },
        {
            "isbn": "c30968db-cb1d-442e-ad0f-80e37c077f89",
            "title": "Henri Potier et la Coupe de feu",
            "price": 29,
            "cover": "http://henri-potier.xebia.fr/hp3.jpg"
        },
        {
            "isbn": "78ee5f25-b84f-45f7-bf33-6c7b30f1b502",
            "title": "Henri Potier et l'Ordre du phénix",
            "price": 28,
            "cover": "http://henri-potier.xebia.fr/hp4.jpg"
        },
        {
            "isbn": "cef179f2-7cbc-41d6-94ca-ecd23d9f7fd6",
            "title": "Henri Potier et le Prince de sang-mêlé",
            "price": 30,
            "cover": "http://henri-potier.xebia.fr/hp5.jpg"
        },
        {
            "isbn": "bbcee412-be64-4a0c-bf1e-315977acd924",
            "title": "Henri Potier et les Reliques de la Mort",
            "price": 35,
            "cover": "http://henri-potier.xebia.fr/hp6.jpg"
        }
    ];

    var mockRestangular = jasmine.createSpyObj('Restangular', ['allUrl', 'getList']);
    mockRestangular.allUrl.and.returnValue(mockRestangular);
    mockRestangular.getList.and.returnValue({
        then: function(fn){
            return fn.call(this, henriPotierBooks);
        }
    });


    describe('Books service', function(){

        beforeEach(module('test.components'));
        beforeEach(function(){
            angular.mock.module('test.components', function($provide){
                $provide.value('Restangular', mockRestangular);
            });
            angular.mock.inject(function($injector){
                booksSvc = $injector.get('booksSvc');
            });
        });

        it('Should return the 7 books', function() {
            booksSvc.getAllBooks().then(function(serverBooks){
                expect(serverBooks).toEqual(henriPotierBooks);
            });
        });

    });
})();
