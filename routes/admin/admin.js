const express = require('express')
const utils = require('../../utils')
const db = require('../../db')
const crypto = require('crypto-js')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const mailer = require('../../mailer')
const router = express.Router()


// ---------------------------------------
//                  POST
// ---------------------------------------

/**
 * @swagger
 *
 * /admin/signin:
 *   post:
 *     description: For signin administrator profile
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email of admin user
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: password of admin user
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: successful message
 */
router.post('/signin', (request, response) => {
    const { email, password } = request.body
    const statement = `select u.email,c.passwd,u.id,u.first_name,u.last_name,u.isActive from user_details u join user_crdntl c  on u.id=c.id where u.email ='${email}' and c.passwd='${password}';`


    db.query(statement, (error, admins) => {
        if (error) {
            response.send({ status: 'error', error: error })
        } else {
            if (admins.length == 0) {
                response.send({ status: 'error', error: 'admin does not exist' })
            } else {
                const admin = admins[0]

                const token = jwt.sign({ id: admin['id'], isActive: admin['isActive'] }, config.secret)

                if (admin['isActive']) {
                    response.send(utils.createResult(error, {
                        first_name: admin['first_name'],
                        last_name: admin['last_name'],
                        isActive: admin['isActive'],
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



/**
 * @swagger
 *
 * /admin/approve:
 *   post:
 *     description: For signin administrator profile
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email of reporter for which request to made 
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: successful message
 */
router.post('/handlerequest', (request, response) => {

    const { email, type } = request.body
    console.log("email, type ", email, type)

    const statement = `update user_details set isActive=1 where email='${email}'`

    db.query(statement, (error, data) => {
        if (error) {
            response.send(utils.createError(error))
        }
        else {

            mailer.sendEmailtoReporter(email, (error, data) => {
                if (error) {
                    response.send(utils.createError(error))

                }
                else {
                    response.send(utils.createSuccess(data))

                }

            })

        }

    })
})


// ---------------------------------------
//                  GET
// ---------------------------------------
/**
 * @swagger
 *
 * /admin/report:
 *   get:
 *     description: To get all news which is fall under report
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful message
 */
router.get('/report', (request, response) => {

    const statement = `select headline,report_ctr,report_reason from news_details where report_ctr>0;`

    db.query(statement, (error, data) => {
        if (error) {
            response.send(utils.createError(error))
        }
        else {

            response.send(utils.createSuccess(data))

        }

    })
})


/**
 * @swagger
 *
 * /admin/reporter-request:
 *   get:
 *     description: To get all Reporter Requests
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful message
 */
router.get('/reporter-request', (request, response) => {

    const statement = `select u.first_name,u.last_name,u.email,u.phone  from request r join user_details u on r.user_details=u.id;`

    db.query(statement, (error, data) => {
        if (error) {
            response.send(utils.createError(error))
        }
        else {

            response.send(utils.createSuccess(data))

        }

    })

})


/**
 * @swagger
 *
 * /admin/users:
 *   get:
 *     description: To get all Users within application
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful message
 */
router.get('/users', (request, response) => {

    const statement = `select first_name,last_name,email,phone,TYPE  from  user_details;`

    db.query(statement, (error, data) => {
        if (error) {
            response.send(utils.createError(error))
        }
        else {

            response.send(utils.createSuccess(data))

        }

    })

})


// ---------------------------------------
//                  PUT
// ---------------------------------------

/**
 * @swagger
 *
 * /admin/blockuser:
 *   put:
 *     description: To block particular user 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: newsId
 *         description: newsId of news 
 *         in: formData
 *         type: string
 *       - name: report_reason
 *         description: report_reason for news 
 *         in: formData
 *         type: string
 *     responses:
 *       200:
 *         description: successful message
 */
router.put("/blockuser", (request, response) => {

    const { userId } = request.body;
    const statement = `update user_details set isActive=0 where id=${userId}`
    db.query(statement, (error, data) => {

        if (error) {
            response.send(utils.createError(error));
        } else {

            response.send(utils.createSuccess(data));

        }
    })

})


module.exports = router
