const {spawn} = require('child_process');
const startDevServer = require('./dev-server');

startDevServer()
  .then(port => spawn('electron', ['.', port], {shell: true, env: process.env, stdio: 'inherit'}));