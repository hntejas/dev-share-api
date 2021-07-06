const jwt = require("jsonwebtoken");

const secret = process.env['jwt-secret'];

const generateJWT = (uid) => {
  return jwt.sign({uid: uid}, secret, {expiresIn: '24h'})
}

const validateJWT = (token) => {
  try{
    return jwt.verify(token, secret);
  }catch(e){
    return;
  } 
}

module.exports = {
  generateJWT,
  validateJWT
}
