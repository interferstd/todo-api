const nodemailer = require('nodemailer')
const config = require('./config/back-end')

const transport = nodemailer.createTransport(config.emailAccount)
// emailAccount = {host, port, secure, auth{user, pass}}

module.exports = {
  send: async (content) => {
    content.from += ` <${config.emailAccount.auth.user}>`
    return await transport.sendMail(content)
  }
}
