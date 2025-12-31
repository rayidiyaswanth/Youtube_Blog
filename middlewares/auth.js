const { validateToken } = require('../services/auth');


function checkForAuthToken(cookiename) {
  return (req, res, next) => {
    const token = req.cookies[cookiename];
    if (!token) {
      return next();
    };
    try {
      const decoded = validateToken(token);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).send('Unauthorized: No auth token provided');
    }
  }
};

module.exports = {
  checkForAuthToken
};