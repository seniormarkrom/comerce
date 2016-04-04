(function() {
  'use strict';

  angular
    .module('test.components')
    .directive('bookCard', bookCard);

  function bookCard(ShoppingCartSvc) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/components/directives/book_card/book_card.tpl.html',
      scope: {
        book: '='
      },
      controller: BookCardController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    //////////////////////////////////////////////////////

    function BookCardController(toastr) {
      var vm = this;

      vm.addToShoppingCart = addToShoppingCart;


      ///////////////////////

      function addToShoppingCart(book){
        var bookAddedSuccessfully = ShoppingCartSvc.addToShoppingCart(book);
        if(bookAddedSuccessfully === true) {
          toastr.info(book.title + ' item added');
        }else{
          toastr.info('error.');
        }
      }
    }
  }

})();
