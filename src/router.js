const handlers = require('./handler.js');

const router = (req, res) => {
  const reqUrl = req.url;
  if (reqUrl === '/') {
    handlers.indexHandler(req, res);
  } else if (req.url.indexOf('/public/') !== -1) {
    handlers.pubicHandler(req, res);
  } else if (reqUrl.indexOf('/?q=') !== -1) {
    console.log(reqUrl);
    handlers.queryHandler(req, res);
  }
};

module.exports = router;
