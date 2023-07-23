const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })
  const refreshToken = cookies.jwt


  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' })
      req.user = decoded.UserInfo.username
      req.roles = decoded.UserInfo.roles
      req.id = decoded.UserInfo.id
      // console.log(     req.id)
      next()
    }
  )
}

module.exports = verifyJWT
