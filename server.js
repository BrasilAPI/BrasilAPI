const express = require('express');
const next = require('next');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dev
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server
    .use(cors())
    .use(helmet())
    .use(compression());

  server.get('*', (req, res) => {
    return handle(req, res);
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Running API in port ${port}`);
  });

}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});