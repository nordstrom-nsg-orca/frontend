const proxy = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(proxy('/infoblox', {
    target: 'https://infoblox.nordstrom.net/wapi/v2.10.3',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/infoblox' : '' }
  }));
};
