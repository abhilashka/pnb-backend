const express = require('express')
const db = require('../../db')
const config = require('../../config')
const utils = require('../../utils')
const crypto = require('crypto-js')
const mailer = require('../../mailer')
const uuid = require('uuid')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')

const router = express.Router()

// ---------------------------------------
//                  GET
// ---------------------------------------

router.get('/', (request, response) => {
  const statement = `select id, firstName, lastName, address, city, country, zip, phone, email, active from user`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})

router.get('/activate/:token', (request, response) => {
  const {token} = request.params

  // activate the user
  // reset the activation token
  const statement = `update user set active = 1, activationToken = '' where activationToken = '${token}'`
  db.query(statement, (error, data) => {

    const htmlPath = path.join(__dirname, '/../templates/activation_result.html')
    const body = '' + fs.readFileSync(htmlPath)
    response.header('Content-Type', 'text/html')
    response.send(body)
  })

})

router.get('/forgot-password/:email', (request, response) => {
  const {email} = request.params
  const statement = `select id, firstName, lastName from user where email = '${email}'`
  db.query(statement, (error, users) => {
    if (error) {
      response.send(utils.createError(error))
    } else if (users.length == 0) {
      response.send(utils.createError('user does not exist'))
    } else {
      const user = users[0]
      const otp = utils.generateOTP()
      const body = `Your otp = ${otp}` 

      mailer.sendEmail(email, 'Reset your password', body,  (error, info) => {
        response.send(
          utils.createResult(error, {
            otp: otp,
            email: email
          })
        )
      })
    }
  })
})


// ---------------------------------------
//                  PUT
// ---------------------------------------



// ---------------------------------------
//                  PUT
// ---------------------------------------

router.put('/toggle-active/:id', (request, response) => {
  const {id} = request.params
  const {status} = request.body
  const statement = `update user set active = ${status} where id = ${id}`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})


// ---------------------------------------
//                  DELETE
// ---------------------------------------



module.exports = router