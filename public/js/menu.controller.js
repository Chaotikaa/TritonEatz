(function () {
'use strict';

angular.module('triton.eatz')
.controller('MenuController', MenuController);

MenuController.$inject = ['$scope', 'MenuService', 'MenuFilter'];
function MenuController ($scope, MenuService, MenuFilter) {

  var self = this;

  self.items = [];
  self.filtered = [];
  self.query = '';

  $scope.$watch(() => self.query, () => self.refilter());

  self.refilter = () => self.filtered = MenuFilter(self.items, 
                                                   self.query);
  

  self.getItemsAndUpdate = (id) => {
    var promise = MenuService.getMenuFor(id);

    promise.then( (response) => {
      self.items = response.data;
      self.filtered = response.data;
      self.query = '';
    }).catch((error) => {
      console.log('Error fetching data:', error);
    });
  }
}

})();