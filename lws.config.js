module.exports = {
  stack: [
    'lws-body-parser',
    'lws-request-monitor',
    'lws-log',
    'lws-compress',
    'lws-mock-response',
    'lws-static',
    'lws-cors',
  ],
  http2: true,
  port: 8443,
  compress: true,
  logFormat: 'combined',
};

