const jwt = require('jsonwebtoken');
//const config = require('../server.js')

//const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["token"];

  if (!token) {
    return res.status(403).json({
    	result:'false',
    	msg:'parameter required token for authentication..'
    });
  }
  try {
  	const TOKEN_KEY = 'gfg_token_header_key';
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({
    	result:'false',
    	msg:'Invalid Token..'
    });
  }
  return next();
};

module.exports = verifyToken;