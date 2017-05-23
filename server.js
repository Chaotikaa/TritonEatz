var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

var app = express();

const URL_CAFE_VENTANAS = 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=18';
const URL_CANYON_VISTA = 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=24;';
const URL_64_DEGREES = 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=64';
const URL_FOODWORX = 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=11';
const URL_OCEANVIEW = 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=05';
const URL_PINES = 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=01';
const URL_BISTRO = 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=27';
const URL_CLUB_MED = 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=15';
const URL_FLAVORS_OF_THE_WORLD = 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=39';
const URL_GOODYS = 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=06';
const URL_GOODYS_TO_GO = 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=38';
const URL_ROOTS = 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=38';
const URL_64_NORTH = 'https://hdh.ucsd.edu/DiningMenus/default.aspx?i=38';


const URLS = [URL_CAFE_VENTANAS, URL_CANYON_VISTA, URL_64_DEGREES, 
  URL_FOODWORX, URL_OCEANVIEW, URL_PINES, URL_BISTRO, URL_CLUB_MED,
  URL_FLAVORS_OF_THE_WORLD, URL_GOODYS, URL_GOODYS_TO_GO, URL_ROOTS, 
  URL_64_NORTH];

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

          // console.log(e.tagName);

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
                name, price, category, subcategory
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