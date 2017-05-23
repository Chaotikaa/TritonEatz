(function () {
'use strict';

angular.module('webscrape', [])
.controller('WebScrapeController', WebScrapeController);

WebScrapeController.$inject = ['$http'];
function WebScrapeController ($http) {
  console.log('in webscrape controller');
}


})();