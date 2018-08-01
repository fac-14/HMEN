const handlers = require('./handler.js');

const router = (req, res) => {
    const url = req.url;
    if (url == "/") {
        handlers.indexHandler(req, res);
    } else if (url.indexOf('/?q=') !== -1) {
        handlers.queryHandler(req, res);
    }
}

module.exports = router;