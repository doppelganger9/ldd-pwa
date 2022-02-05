module.exports = {
  stack: [
    'lws-redirect',
  ],
  port: 8000,
  logFormat: 'combined',
  redirect: 'http(s?)://(.+):8000 -> https://$2:8443',
};

