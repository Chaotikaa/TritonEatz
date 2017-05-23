var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var URLS = require('./src/utils/url.js');
var menus = require('./src/utils/menus.js');

var app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/menus', (req, res) => {

  var id = 0;

  if (req.query.id) {
    id = req.query.id;
  }

  // console.log(menus[0]);

  res.send(menus[id]);
});

app.listen(8081, () => {
  console.log('Listening on port 8081...');
});