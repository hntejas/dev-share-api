const {validateJWT} = require("../utils/jwt");

const verifyAuth = (req, res, next) => {
  const authToken = req.headers.authorization;
  const decodedToken = validateJWT(authToken);
  if(decodedToken && decodedToken.uid){
    req.uid = decodedToken.uid;
    next();
  }else{
    res.status(401).json({
      success: false,
      error: {
        message: "Unauthorized"
      }
    })
  }
}

module.exports = verifyAuth;