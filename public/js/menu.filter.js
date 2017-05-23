(function () {
'use strict';

angular.module('triton.eatz')
.filter('Menu', Filter);

function Filter () {
  return function (items, filterOn) {
    filterOn = filterOn.toLowerCase();
    return items.filter(function (val) {
      // console.log(val.name);
      if (filterOn === undefined) {
        return true;
      } else {
        return val.name.toLowerCase().indexOf(filterOn) !== -1 ||
          val.category.toLowerCase().indexOf(filterOn) !== -1 ||
          val.category.toLowerCase().indexOf(filterOn) !== -1;
      }
    });
  }
}

})();

