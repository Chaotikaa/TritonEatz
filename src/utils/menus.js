var request = require('request');
var URLS = require('./url.js');
var cheerio = require('cheerio');



var menus = [];

function getMenu (id) {
  // console.log(URLS[id]);
  var list_class = id >= 6 ? '.SpecialtyItemList' : '.itemList';

  request(URLS[id], (err, response, body) => {
    if(!err) {
      var $ = cheerio.load(body);

      var menu = [];

      var first_name = null;
      var rep = false;
      var categories = [];

      $('.restaurantTitle').each((i, elm) => {
        var main_cat = $(elm).text().trim();
        // console.log(main_cat);
        if (!categories.includes(main_cat)) {
            categories.push(main_cat);
        }
      });

      // console.log(categories);

      $(list_class).each((i, elm) => {
        // console.log(i);
        if (categories.length != 0) {
          // console.log('switch categories');
          var curr_cat = categories[i % categories.length];
        }
        // console.log(elm.tagName);
        var curr_sub;

        $(elm).children().each((i, e) => {

          if (e.tagName === 'p') {
            curr_sub = $(e).text();
          }

          if (e.tagName === 'li') {

            var text = $(e).text().trim();
            var price_loc = text.lastIndexOf('(');

            var name = text.substr(0, price_loc - 1).trim();
              
            if (first_name) {
              if (name == first_name) {
                rep = true;
              }
            } else {
              first_name = first_name || name;            }
            
            if (!rep) {

              var price = text.slice(price_loc);
              var category = curr_cat;
              var subcategory = curr_sub;
              price = price.substr(1, price.length - 2);

              var item = {
                name, 
                price, 
                category, 
                subcategory
              };

              if (name != '' && item != ''){
                menu.push(item);
              }
            }
          }
        });
      });
      menus[id] = menu;
      
      // res.json(menu);
    } else {
      console.log(err);
      // res.status(404).send('Could not scrape.');
    }
  });
}

for (var i = 0; i < URLS.length; i++) {
  // console.log(URLS[i]);
  getMenu(i);
}

// console.log(menus);

module.exports = menus;