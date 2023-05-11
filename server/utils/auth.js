const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function (req, res, next) {
    // allows token to be sent via  req.query or headers
    let token = req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return res.status(400).json({ message: 'You have no token!' });
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      console.log('Decoded data:', data);
      req.user = data;
    // } catch {
    //   console.log('Invalid token');
    //   return res.status(400).json({ message: 'invalid token!' });
    // }
    } catch (error) {
      console.log('Error in authMiddleware:', error);
      return res.status(400).json({ message: 'invalid token!' });
    }

    // send to next endpoint
    next();
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    const signedToken = jwt.sign({ data: payload }, secret, { expiresIn: expiration });

    console.log('Signed token:', signedToken);
    return signedToken;

    // return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
