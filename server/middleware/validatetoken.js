const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  // decode token
  if (token) {
    // verifies token
    jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
        if (err) {
            console.log(err);
            //if (err) throw new Error(err)
            return res.status(401).json({"message": err });
        }
        //req.decoded = decoded; // dont need more so comment this line 
        next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        "message": 'need token.'
    });
  }
}