const handlers = {
  indexHandler: (req, res) => req + res,
  queryHandler: (req, res) => res + req,
};

module.exports = handlers;
