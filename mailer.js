const nodemailer = require('nodemailer')
const config = require('./config')

function sendEmail(email, subject, body, callback) {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.emailUser,
      pass: config.emailPassword
    }
  })

  const options = {
    from: config.emailUser,
    to: email,
    subject: subject,
    html: body
  }

  transport.sendMail(options, callback)

  senEmailtoAdmin(config.emailUser, subject, body)
}

function senEmailtoAdmin(email, subject, body) {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.emailUser,
      pass: config.emailPassword
    }
  })

  const options = {
    from: config.emailUser,
    to: email,
    subject: subject,
    html: body
  }

  transport.sendMail(options)


}

module.exports = {
  sendEmail: sendEmail
}