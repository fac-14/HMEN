const fs = require('fs');
const path = require('path');
const request = require('request');
require('dotenv').config();

const config = {
  GUARDIAN_KEY: process.env.GUARDIAN_KEY,
  NYT_KEY: process.env.NYT_KEY,
};

let guardianData;
let nytData;

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
    // console.log('parsed data: ', parsedData);
    if (url.indexOf('guardian') !== -1) {
      guardianData = parsedData.response.results[0].fields.bodyText;
    } else {
      nytData = parsedData.response.docs[0].multimedia[0].url;
    }
  });
}

const makeRequests = (req, res, guardianUrl, nytUrl, callback) => {
  apiRequest(req, res, nytUrl);
  apiRequest(req, res, guardianUrl);
  setTimeout(() => {
    callback(guardianData, nytData);
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
    const nytUrl = `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=${config.NYT_KEY}`;

    makeRequests(req, res, guardianUrl, nytUrl, () => {
      const response = {
        'guardian-data': guardianData,
        'nyt-data': nytData,
      };
      res.writeHead(200, { 'Content-Type': 'text/html' });
      console.log('response object: ', response);
      console.log('stringified response object: ', JSON.stringify(response));
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
