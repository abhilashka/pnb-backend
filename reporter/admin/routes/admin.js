const express = require('express')
const utils = require('../../utils')
const db = require('../../db')
const config = require('../../config')
const crypto = require('crypto-js')
const jwt = require('jsonwebtoken')

const router = express.Router()


// ----------------------------------------------------
// GET
// ----------------------------------------------------

/**
 * @swagger
 *
 * /admin/profile:
 *   get:
 *     description: For getting administrator profile
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful message
 */
router.get('/profile', (request, response) => {
  const statement = `select firstName, lastName, email, phone from admin where id = ${request.userId}`
  db.query(statement, (error, admins) => {
    if (error) {
      response.send({status: 'error', error: error})
    } else {
      if (admins.length == 0) {
        response.send({status: 'error', error: 'admin does not exist'})
      } else {
        const admin = admins[0]
        response.send(utils.createResult(error, admin))
      }
    }
  })
})

// ----------------------------------------------------



// ----------------------------------------------------
// POST
// ----------------------------------------------------

/**
 * @swagger
 *
 * /admin/signup:
 *   post:
 *     description: For signing up an administrator
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: firstName
 *         description: first name of admin user
 *         in: formData
 *         required: true
 *         type: string
 *       - name: lastName
 *         description: last name of admin user
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: email of admin user used for authentication
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: admin's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: successful message
 */
router.post('/signup', (request, response) => {
  const { firstName, lastName, email, password } = request.body

  const encryptedPassword = crypto.SHA256(password)
  const statement = `insert into admin (firstName, lastName, email, password) values (
    '${firstName}', '${lastName}', '${email}', '${encryptedPassword}'
  )`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})


/**
 * @swagger
 *
 * /admin/signin:
 *   post:
 *     description: For signing in an administrator
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email of admin user used for authentication
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: admin's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: successful message
 */
router.post('/signin', (request, response) => {
  const {email, password} = request.body
  const statement = `select id, firstName, lastName from admin where email = '${email}' and password = '${crypto.SHA256(password)}'`
  db.query(statement, (error, admins) => {
    if (error) {
      response.send({status: 'error', error: error})
    } else {
      if (admins.length == 0) {
        response.send({status: 'error', error: 'admin does not exist'})
      } else {
        const admin = admins[0]
        const token = jwt.sign({id: admin['id']}, config.secret)
        response.send(utils.createResult(error, {
          firstName: admin['firstName'],
          lastName: admin['lastName'],
          token: token
        }))
      }
    }
  })
})

// ----------------------------------------------------



// ----------------------------------------------------
// PUT
// ----------------------------------------------------

router.put('', (request, response) => {
  response.send()
})

// ----------------------------------------------------



// ----------------------------------------------------
// DELETE
// ----------------------------------------------------

router.delete('', (request, response) => {
  response.send()
})

// ----------------------------------------------------

module.exports = router