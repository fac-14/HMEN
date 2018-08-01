const fs = require('fs');
const path = require('path');

function publicPath(fileName) {
  return path.join(__dirname, '..', 'public', fileName);
}
function returnError(error, res) {
  res.writeHead(500, { 'Content-Type': 'text/html' });
  res.end('You\'ve fucked up');
}

const handlers = {
  indexHandler: (req, res) => {
    fs.readFile(publicPath('index.html'),
      (error, file) => {
        if (error) {
          returnError(error, res);
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(file);
        }
      });
  },
  // pubicHandler: (req, res) => {
  //   const extensionType = {
  //     html: 'text/html',
  //     css: 'text/css',
  //   };
  // },
  // queryHandler: (req, res) => res + req,
};

module.exports = handlers;
