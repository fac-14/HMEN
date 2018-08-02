const fs = require('fs');
const path = require('path');
const request = require('request');

const config = {
  GUARDIAN_KEY: '7de6cbf7-40ff-4edd-9fe6-4d9b1b20a26b',
  NYT_KEY: '401b373f944f41afa50d7c8294713694',
};

function pubicPath(fileName) {
  return path.join(__dirname, '..', 'public', fileName);
}

function returnError(error, res) {
  res.writeHead(500, { 'Content-Type': 'text/html' });
  res.end('You\'ve fucked up');
}
<<<<<<< HEAD
//---------------API REQUEST
function apiRequest(req, url) {
=======

function apiRequest(req, res, url) {
>>>>>>> master
  request(url, (error, response, body) => {
    console.log('Error: ', error);
    // console.log('statusCode: ', response && response.statusCode);
    const parsedData = JSON.parse(body);
<<<<<<< HEAD
    // console.log('Body: ', parsedData.response.results[0].fields.bodyText);
    console.log(parsedData.response.docs[0].multimedia[0].url);
=======
    console.log('Body: ', parsedData.response.results[0].fields.bodyText);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(JSON.stringify(parsedData.response.results[0].fields.bodyText));
>>>>>>> master
  });
}
//---------------HANDLERS
const handlers = {
//---------------TO LOAD HTML IN BROWSER
  indexHandler: (req, res) => {
    fs.readFile(pubicPath('index.html'),
      (error, file) => {
        if (error) {
          returnError(error, res);
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(file);
        }
      });
  },
// ---------------TO LOAD CSS AND SCRIPTS IN THE BROWSER
  pubicHandler: (req, res) => {
    const extensionType = {
      html: 'text/html',
      css: 'text/css',
      js: 'application/javascript',
      json: 'application/json',
      jpg: 'image/jpg',
      ico: 'image/x-icon',
      png: 'image/png',
    };
    const ext = req.url.split('.')[1];
    fs.readFile(path.join(__dirname, '..', req.url),
      (error, file) => {
        if (error) {
          returnError(error, res);
        } else {
          res.writeHead(200, { 'Content-Type': `${extensionType[ext]}` });
          res.end(file);
        }
      });
  },
//------------------TO HANDLE CLIENT REQUEST
  queryHandler: (req, res) => {
    
//------------------URL CONSTRUCTOR
    const query = req.url.split('?q=')[1].split('&')[0];
    const guardianUrl = `https://content.guardianapis.com/search?q=${query}&show-fields=bodyText&api-key=${config.GUARDIAN_KEY}`;
<<<<<<< HEAD
    const nytUrl = `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=${config.NYT_KEY}`;

    // apiRequest(req, guardianUrl);
    apiRequest(req,nytUrl);
    // console.log(res);
=======
    // make nyt url
    apiRequest(req, res, guardianUrl);
>>>>>>> master
  },
};

module.exports = handlers;
