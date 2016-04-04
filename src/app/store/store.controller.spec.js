(function() {
    'use strict';

    var vm;

    describe('Store Controller', function(){

        beforeEach(module('ui.router'));
        beforeEach(module('test.store'));
        beforeEach(inject(function($controller){
            vm = $controller('StoreCtrl', {
                $stateProvider: {},
                books: []
            });
        }));

        it('books should be defined', function(){
            expect(angular.isArray(vm.books)).toBeTruthy();
        });

        describe('Functions', function(){

        });

    });
})();
