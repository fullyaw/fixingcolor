var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
var User = require('../models/user');
var config = require('../config/database'); // get db config file

module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, next) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
          if (err) {
              console.log('err' + err);
              return next(err, false);
          }
          if (user) {
              console.log('found user');
              return next(null, user);
          } else {
              console.log('no user');
              return next(null, false);
          }
      }).catch(err => next(err));
  }));
};