const fs = require('fs');
const path = require('fs');

function publicPath(fileName) { path.join(__dirname, '..', 'public', fileName); }
function returnError(error, res) {
  console.log(error);
  res.writeHead(500, 'Content-Type : text/html');
  res.end("You've fucked up");
}

const handlers = {
  indexHandler: (req, res) => {
    fs.readFile(publicPath('index.html'),
      (error, file) => {
        if (error) {
          returnError(error, res);
        } else {
          res.writeHead(200, 'Content-Type:text/html');
          res.end(file);
        }
      });
  },
  queryHandler: (req, res) => res + req,
};

module.exports = handlers;
