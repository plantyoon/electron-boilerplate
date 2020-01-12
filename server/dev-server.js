const webpack = require('webpack');
const compiler = webpack(require('./webpack.config'));

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  stats: 'minimal',
  historyApiFallback: true,
});
const hotMiddleware = require('webpack-hot-middleware')(compiler);

const path = require('path');
const net = require('net');
const fs = require('fs');
const app = require('express')();

const {defaultPort} = require('./config');

compiler.hooks.done.tap('ProgressPlugin', () => {
  console.clear();
  console.log(`\nServer running at : \u001b[32;1m\u001b[4m${`http://localhost:${defaultPort}`}\u001b[0m\n`);
});

let server = null;
let proc = null;
async function startDevServer() {
  const port = await new Promise(resolve => net.createServer()
    .once('error', () => resolve(false))
    .once('listening', function () {this.once('close', () => resolve(true)).close()})
    .listen(defaultPort))
    ? defaultPort
    : await new Promise(resolve => {
      const server = net.createServer();
      server.listen(0, () => (resolve(server.address().port), server.close()));
    });

  app.use(devMiddleware);
  app.use(hotMiddleware);
  app.use('*', (req, res, next) => { // https://github.com/jantimon/html-webpack-plugin/issues/145#issuecomment-170554832
    var filename = path.join(compiler.outputPath,'index.html');
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err);
      }
      res.set('content-type','text/html');
      res.send(result);
      res.end();
    });
  });  

  await new Promise(resolve => app.listen(port, resolve));
  return port;
}

module.exports = startDevServer;