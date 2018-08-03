const fs = require('fs');
const path = require('path');
const request = require('request');
require('dotenv').config();

const config = {
  GUARDIAN_KEY: process.env.GUARDIAN_KEY,
  NYT_KEY: process.env.NYT_KEY,
  GIPHY_KEY: process.env.GIPHY_KEY,
};

let article;
let gif;
let nyt;
let responseArr = [];

function pubicPath(fileName) {
  return path.join(__dirname, '..', 'public', fileName);
}

function returnError(error, res) {
  res.writeHead(500, { 'Content-Type': 'text/html' });
  res.end('You\'ve fucked up');
}

function apiRequest(req, res, url, callback) {
  request(url, (error, response, body) => {
    // console.log('Error: ', error);
    const parsedData = JSON.parse(body);
    if (url.indexOf('guardian') !== -1) {
      article = { Guardian: { article: parsedData.response.results[1].fields.bodyText } };
      responseArr.push(article);
    } else if (url.indexOf('giphy') !== -1) {
      gif = { Giphy: { gif: parsedData.data[0].images.downsized_medium.url } };
      responseArr.push(gif);
    } else {
      const content = parsedData.response.docs;
      nyt = { nyt: { headline: content[1].headline.main, summary: content[1].abstract } };
      responseArr.push(nyt);
    }
    callback();
  });
}

const makeRequests = (req, res, guardianUrl, nytUrl, giphyUrl, callback) => {
  apiRequest(req, res, nytUrl, callback);
  apiRequest(req, res, guardianUrl, callback);
  apiRequest(req, res, giphyUrl, callback);
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
      if (responseArr.length === 3) {
        console.log(responseArr);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(JSON.stringify(responseArr));
      }
    });
  },
};

module.exports = handlers;
