(function(){
    'use strict';

    angular
        .module('test.components')
        .service('booksSvc', booksSvc);

    function booksSvc(Restangular, $q){

        return {
            getAllBooks: getAllBooks
        };

        /////////////////////////////////////

        function getAllBooks(){
            var deferred = $q.defer();

            Restangular.allUrl('books', 'http://henri-potier.xebia.fr/books').getList().then(function(serverBooks){
                deferred.resolve(serverBooks);
            }, function(err){
                deferred.reject(err);
                console.error('Unexpected error: ', err);
            });

            return deferred.promise;
        }

    }

})();
