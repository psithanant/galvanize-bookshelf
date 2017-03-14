const jwt = require('jsonwebtoken');

const checkToken = function(req, res, next) {
  return jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
     if (err) {
       res.set("Content-Type", "text/plain");
       res.status(401).send("Unauthorized");
       return;
     }
     req.user = payload;
     return next();
   });
};

module.exports = checkToken;
