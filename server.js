var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var URLS = require('./utils/url.js');

var app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/scrape', (req, res) => {

  var id = 0;

  if (req.query.id) {
    id = req.query.id;
  }

  request(URLS[id], (err, response, body) => {
    if(!err) {
      var $ = cheerio.load(body);

      var menu = new Set();

      var first_name = null;
      var rep = false;
      var categories = [];

      $('.restaurantTitle').each((i, elm) => {
        var main_cat = $(elm).text().trim();
        if (!categories.includes(main_cat)) {
          categories.push(main_cat);
        }
      });

      console.log(categories);

      $(['.itemList', '.SpecialtyItemList']).each((i, elm) => {
        if (categories.length != 0) {
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
              first_name = first_name || name;
            }

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
                menu.add(item);
              }
            }
          }
        });
      });

      res.json(Array.from(menu));
    } else {
      console.log(err);
      res.status(404).send('Could not scrape.');
    }
  });
});

app.listen(8081, () => {
  console.log('Listening on port 8081...');
});