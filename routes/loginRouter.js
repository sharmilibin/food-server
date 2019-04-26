var express = require('express');
var loginRouter = express.Router();

loginRouter.route('/').post((req, res, next) => {
  res.statusCode = 201;
  res.setHeader('Content-Type', 'application-json');
  res.end('user Logged in sucessfully');
});
module.exports = loginRouter;
