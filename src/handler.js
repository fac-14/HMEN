const fs = require('fs');
const path = require('path');
const request = require('request');
require('dotenv').config();

const config = {
  'GUARDIAN_KEY': process.env.GUARDIAN_KEY,
  'NYT_KEY': process.env.NYT_KEY,
};

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
    console.log('statusCode: ', response && response.statusCode);
    const parsedData = JSON.parse(body);
    console.log('Body: ', parsedData.response.results[0].fields.bodyText);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(JSON.stringify(parsedData.response.results[0].fields.bodyText));
  });
}

const handlers = {
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
  queryHandler: (req, res) => {
    const query = req.url.split('?q=')[1].split('&')[0];
    const guardianUrl = `https://content.guardianapis.com/search?q=${query}&show-fields=bodyText&api-key=${config.GUARDIAN_KEY}`;
    // make nyt url
    apiRequest(req, res, guardianUrl);
  },
};

module.exports = handlers;
