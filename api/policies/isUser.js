
module.exports = (req, res, next) => {
  let token;

  if (req.headers && req.headers.token) {
    token = req.headers.token;
    if (token.length <= 0) return res.status(401).send({err: 'Format is Authorization: Bearer [token]'});

  } else if (req.param('token')) {
    token = req.param('token');
    // We delete the token from param to not mess with blueprints
    delete req.query.token;
  } else {
    sails.log.info(`No Authorization header (token) was found`)
    return res.status(401).send({err: `No Authorization header (token) was found`});
  }

  jwToken.verify(token, function (err, token) {
    if (err) return res.status(401).send({err: 'Invalid Token!'});
    req.token = token; // This is the decrypted token or the payload you provided
    next();
  });
};
