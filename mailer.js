const nodemailer = require('nodemailer')
const config = require('./config')
const fs = require('fs')
const path = require('path')

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

}

function sendEmailtoAdmin(callback) {
  const subject = `New Registration Request-Public New Board`
  const htmlPath = path.join(__dirname, '/./templates/admin_notification.html')
  let body = '' + fs.readFileSync(htmlPath)
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.emailUser,
      pass: config.emailPassword
    }
  })

  const options = {
    from: config.emailUser,
    to: config.emailUser,
    subject: subject,
    html: body
  }

  transport.sendMail(options, callback)


}


function sendEmailtoReporter(email, name, callback) {
  const subject = `Public New Board - Account is Active now  `
  const htmlPath = path.join(__dirname, '/./templates/reporter-activation.html')
  let body = '' + fs.readFileSync(htmlPath)
  body = body.replace('firstName', name)

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


}




module.exports = {
  sendEmail: sendEmail,
  sendEmailtoAdmin: sendEmailtoAdmin,
  sendEmailtoReporter: sendEmailtoReporter
}