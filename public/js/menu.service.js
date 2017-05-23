(function () {
'use strict';

angular.module('triton.eatz')
.service('MenuService', MenuService);

MenuService.$inject = ['$http'];
function MenuService ($http) {

  var self = this;

  self.getMenuFor = (id) => {
    return $http({
      url: '/menus',
      params: {
        id
      }
    });
  }
}

})();