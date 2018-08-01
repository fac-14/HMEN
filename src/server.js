const http = require('http');
const routes = require('./router');

const server = http.createServer(routes);
const port = process.env.PORT || 4000;
const host = process.env.HOST || 'localhost';

server.listen(port, () => {
  console.log(`Server running on ${host} ${port}`);
});
