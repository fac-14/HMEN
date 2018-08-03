const test = require('tape');
const supertest = require('supertest');
const router = require('./router');

test('Initialise', (t) => {
  const num = 2;
  t.equal(num, 2, 'Should return 2');
  t.end();
});

test('Home route returns a status code of 200', (t) => {
  supertest(router)
    .get('/')
    .expect(200)
    .expect('Content-Type', /html/)
    .end((err, res) => {
      t.error(err);
      t.equal(res.statusCode, 200, 'Should return 200');
      t.end();
    });
});
