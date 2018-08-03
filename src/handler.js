const fs = require('fs');
const path = require('path');
const request = require('request');
require('dotenv').config();

const config = {
  GUARDIAN_KEY: process.env.GUARDIAN_KEY,
  NYT_KEY: process.env.NYT_KEY,
  GIPHY_KEY: process.env.GIPHY_KEY,
};

let headline;
let summary = '';
let article;
let gif;
let pubDate;

function pubicPath(fileName) {
  return path.join(__dirname, '..', 'public', fileName);
}

function returnError(error, res) {
  res.writeHead(500, { 'Content-Type': 'text/html' });
  res.end('You\'ve fucked up');
}

function apiRequest(req, res, url) {
  request(url, (error, response, body) => {
    console.log('Error: ', error);
    const parsedData = JSON.parse(body);
    if (url.indexOf('guardian') !== -1) {
      article = parsedData.response.results[1].fields.bodyText;
    } else if (url.indexOf('giphy') !== -1) {
      gif = parsedData.data[0].images.downsized_medium.url;
    } else {
      const content = parsedData.response.docs;
      headline = content[1].headline.main;
      summary = content[1].abstract;
      // pubDate = content[0].pub_date.split('T')[0];
    }
  });
}

const makeRequests = (req, res, guardianUrl, nytUrl, giphyUrl, callback) => {
  apiRequest(req, res, nytUrl);
  apiRequest(req, res, guardianUrl);
  apiRequest(req, res, giphyUrl);
  setTimeout(() => {
    callback();
  }, 2000);
};

// ---------------HANDLERS
const handlers = {
// ---------------TO LOAD HTML IN BROWSER
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
  // ------------------TO HANDLE CLIENT REQUEST
  queryHandler: (req, res) => {
    // ------------------URL CONSTRUCTOR
    const query = req.url.split('?q=')[1].split('&')[0];
    const guardianUrl = `https://content.guardianapis.com/search?q=${query}&show-fields=bodyText&api-key=${config.GUARDIAN_KEY}`;
    const nytUrl = `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&begin_date=19000101&end_date=19200101&fl=abstract&fl=headline&fl=snippet&fl=pub_date&api-key=${config.NYT_KEY}`;
    const giphyUrl = `https://api.giphy.com/v1/gifs/search?q=${query}&api_key=${config.GIPHY_KEY}`;

    makeRequests(req, res, guardianUrl, nytUrl, giphyUrl, () => {
      const response = {
        headline,
        summary,
        article,
        pub_date: pubDate,
        gif,
      };
      res.writeHead(200, { 'Content-Type': 'text/html' });
      console.log('response object: ', response);
      res.end(JSON.stringify(response));
    });
  },
};

// ---- API CALL PLAN
// 1. Make request in apiRequest to each of the APIs
  // 1a. return .json object and parse it
// 2. Make another function to catch the two responses
  // 2a. Extract the info we want from the response
  // 2b. Use the global parseObject and assign the desired info to it
  // 2b. Return a new object with the desired info
// 3. Make a final callback
  // 3a. Stringify the new object and send it over to the client side

module.exports = handlers;
