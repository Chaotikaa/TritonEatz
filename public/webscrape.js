(function () {
'use strict';

angular.module('webscrape', ['ui.router'])
.controller('WebScrapeController', WebScrapeController)
.service('MenuService', MenuService)
.filter('MenuItems', Filter);

function Filter () {
  return function (items, filterOn) {
    filterOn = filterOn.toLowerCase();
    return items.filter(function (val) {
      console.log(val.name);
      if (filterOn === undefined || filterOn === '') {
        return true;
      } else {
        return val.name.toLowerCase().indexOf(filterOn) !== -1 ||
          val.category.toLowerCase().indexOf(filterOn) !== -1 ||
          val.category.toLowerCase().indexOf(filterOn) !== -1;
      }
    });
  }
}

WebScrapeController.$inject = ['$http', '$scope', 'MenuService', 'MenuItemsFilter'];
function WebScrapeController ($http, $scope, MenuService, MenuItemsFilter) {

  var wctrl = this;

  wctrl.items = [];
  wctrl.filtered = [];
  wctrl.query = '';

  $scope.$watch(function () { return wctrl.query } , function (newValue, oldValue) {
    wctrl.refilter();
  });

  wctrl.refilter = function () {
    wctrl.filtered = MenuItemsFilter(wctrl.items, wctrl.query);
  }

  wctrl.getItemsAndUpdate = function (id) {
    var promise = MenuService.getMenuFor(id);

    promise.then(function (response) {
      wctrl.items = response.data;
      wctrl.filtered = response.data;
      wctrl.query = '';
    }).catch(function (error) {
    });
  }
}

MenuService.$inject = ['$http'];
function MenuService ($http) {

  var service = this;

  service.getMenuFor = function (id) {
    return $http({
      url: '/scrape',
      params: {
        id
      }
    });
  }
}



})();