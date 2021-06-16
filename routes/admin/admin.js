const express = require('express')
const utils = require('../../utils')
const db = require('../../db')
const crypto = require('crypto-js')
const jwt = require('jsonwebtoken')
const config = require('../../config')

const router = express.Router()


//sign in
router.post('/signin', (request, response) => {
    const { email, password } = request.body
    const statement = `select u.email,c.passwd,u.id,u.first_name,u.last_name,u.isActive from user_details u join user_crdntl c  on u.id=c.id where u.email ='${email}' and c.passwd='${password}';`


    db.query(statement, (error, reporters) => {
        if (error) {
            response.send({ status: 'error', error: error })
        } else {
            if (reporters.length == 0) {
                response.send({ status: 'error', error: 'reporter does not exist' })
            } else {
                const reporter = reporters[0]

                const token = jwt.sign({ id: reporter['id'] }, config.secret)

                if (reporter['isActive']) {
                    response.send(utils.createResult(error, {
                        first_name: reporter['first_name'],
                        last_name: reporter['last_name'],
                        isActive: reporter['isActive'],
                        token: token
                    }))
                }
                else {
                    response.send({ status: "success", error: "you dont have access" })
                }
            }
        }
    })

})




router.post('/approve', (request, response) => {

    const { email } = request.body
    const statement = `update user_details set isActive=1 where email='${email}'`

    db.query(statement, (error, data) => {
        if (error) {
            response.send(utils.createError(error))
        }
        else {
            response.send(utils.createSuccess(data))

        }

    })
})