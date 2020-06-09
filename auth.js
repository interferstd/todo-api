const jwt = require('jsonwebtoken')
const User = require('./database/User')
const config = require('./config/back-end')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, config.privetKey)
    const user = await User.findOne({ _id: data._id, 'tokens.token': token })
    if (!user) {
      throw new Error('Not authorized')
    }
    req.user = user
    req.token = token
    next()
  } catch (error) {
    res.status(401).send({ error: 'Not authorized to access this resource' })
  }
}

module.exports = auth
