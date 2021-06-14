
const express = require('express')
const utils = require('../utils')
const db = require('../db')
const config = require('../config')
const crypto = require('crypto-js')
const jwt = require('jsonwebtoken')

const router = express.Router()

//sign in
router.post('/signin', (request, response) => {
    const { email, password } = request.body
    const statement = `select id, firstName, lastName from admin where email = '${email}' and password = '${crypto.SHA256(password)}'`
    db.query(statement, (error, admins) => {
        if (error) {
            response.send({ status: 'error', error: error })
        } else {
            if (admins.length == 0) {
                response.send({ status: 'error', error: 'admin does not exist' })
            } else {
                const admin = admins[0]
                const token = jwt.sign({ id: admin['id'] }, config.secret)
                response.send(utils.createResult(error, {
                    firstName: admin['firstName'],
                    lastName: admin['lastName'],
                    token: token
                }))
            }
        }
    })
})



//registration

