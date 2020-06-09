const parser = require('body-parser')

const apiRouter = require('./routers/api')
const front = require('./config/front-end')
require('./database/connect')

module.exports = {
  installOn: (server) => {
    server.use(parser.json({ extended: true }))
    server.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', front.domain) // update to match the domain you will make the request from
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      )
      next()
    })
    server.use('/api', apiRouter)
  }
}
