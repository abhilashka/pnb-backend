const express = require('express')
const utils = require('../utils')
const db = require('../db')
const crypto = require('crypto-js')
const jwt = require('jsonwebtoken')
const config = require('../config')
const mailer = require('../mailer')
const router = express.Router()
const uuid = require('uuid')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const url = process.env.PROD_HOST
const port = process.env.PROD_PORT



// ---------------------------------------
//                  GET
// ---------------------------------------
/**
 * @swagger
 *
 * /oAuth/activate/:token:
 *   get:
 *     description: For Activating readers account after verifying a email
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful message
 */
router.get('/activate/:token', (request, response) => {
    const { token } = request.params

    // activate the user
    // reset the activation token
    const statement = `update user_details set isVerified = 1, activationToken = '' where activationToken = '${token}'`
    db.query(statement, (error, data) => {

        const htmlPath = path.join(__dirname, '/../templates/activation_result.html')
        const body = '' + fs.readFileSync(htmlPath)
        response.header('Content-Type', 'text/html')
        response.send(body)
    })

})


router.get("/getprofile", (request, response) => {
    const { email } = request.body;

    const statement = `SELECT first_name,last_name,phone,email,passwd,city,state,pincode
    FROM ((user_details
    INNER JOIN address ON user_details.address_id = address.id)
    INNER JOIN user_crdntl ON user_details.id = user_crdntl.id) where email='${email}';`
    db.query(statement, (error, data) => {
        if (error) {
            response.send(utils.createError(error));
            console.log(`error`);
        } else {
            response.send(utils.createSuccess(data));
            console.log(`data`);
        }
    });
});





// ---------------------------------------
//                  POST
// ---------------------------------------

//sign up
/**
 * @swagger
 *
 * /oAuth/signup:
 *   post:
 *     description: For signup of  reader/reporter 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: first_name
 *         description: first_name of reader/reporter
 *         in: formData
 *         required: true
 *         type: string
 *       - name: last_name
 *         description: last_name of reader/reporter
 *         in: formData
 *         required: true
 *         type: string
 *       - name: phone
 *         description: phone of reader/reporter
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: email of reader/reporter
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: password of reader/reporter
 *         in: formData
 *         required: true
 *         type: string
 *       - name: city
 *         description: city of reader/reporter
 *         in: formData
 *         required: true
 *         type: string
 *       - name: localities
 *         description: localities of reader/reporter
 *         in: formData
 *         required: true
 *         type: string
 *       - name: state
 *         description: state of reader/reporter
 *         in: formData
 *         required: true
 *         type: string
 *       - name: pincode
 *         description: pincode of reader/reporter
 *         in: formData
 *         required: true
 *         type: string
 *       - name: type
 *         description: type of reader/reporter
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: successful message
 */
router.post('/signup', (request, response) => {

    const { first_name, last_name, phone, email, password, city, localities, state, pincode, type } = request.body;
    const encryptedPass = crypto.SHA256(password);

    const activationToken = uuid.v4()
    const activationLink = `${url}${port}/oAuth/activate/${activationToken}`
    const logoLink = `./images/logo.svg`

    console.log(activationLink)
    console.log(logoLink)

    let htmlPath = ``;
    let body = ``;


    const statement1 = `insert into address(city,localities,state,pincode) VALUES('${city}','${localities}','${state}','${pincode}');`


    var isActive = 0;
    var isVerified = 0;

    db.query(statement1, (error, data) => {

    })

    const stm = `SELECT MAX(id) AS MaxId FROM address`;
    var maxId = 0;
    db.query(stm, (error, data) => {
        if (error) {
            response.send(utils.createError(error))

        }
        else {
            console.log(data[0].MaxId);
            maxId = data[0].MaxId + 1;
            if (type === 'RED') {
                isActive = 1
            }

            if (type === 'REP') {
                isVerified = 1
            }

            const statement2 = `insert into user_details(first_name,last_name,address_id,phone,email,TYPE,isActive,activationToken,isVerified) values('${first_name}','${last_name}',(select id from address where id='${maxId}'),'${phone}','${email}','${type}','${isActive}','${activationToken}','${isVerified}');`
            db.query(statement2, (error, data) => {
                if (error) {

                    console.log("error", error.sqlMessage)
                    if (error.sqlMessage.includes("user_details.phone")) {
                        response.send(utils.createError("phone"))
                    } else {
                        response.send(utils.createError("email"))
                    }
                }
                else {

                    const statement = `insert into user_crdntl (user_id,passwd) values ((select id from user_details where email='${email}'),'${password}')`
                    db.query(statement, (error, data) => {
                        if (error) {
                            response.send(utils.createError(error))


                        }
                        else {

                            if (type == 'REP') {
                                htmlPath = path.join(__dirname, '/../templates/reporter-notification.html')
                                body = '' + fs.readFileSync(htmlPath)
                                body = body.replace('firstName', first_name)
                                mailer.sendEmail(email, 'Public News Board ', body, (error, info) => {

                                    if (error) {
                                        response.send(utils.createError(error))
                                    }
                                    else {
                                        const stm = `SELECT MAX(id) AS MaxId FROM user_details`;
                                        let userid
                                        db.query(stm, (error, data) => {
                                            if (error) {
                                                response.send(utils.createError(error))

                                            }
                                            else {
                                                userid = data[0].MaxId;
                                                console.log("userid", userid)

                                                const statement = `insert into request(user_details) values('${userid}') `

                                                db.query(statement, (error, data) => {
                                                    if (error) {
                                                        response.send(utils.createError(error))

                                                    }
                                                    else {
                                                        console.log("data", data)
                                                        mailer.sendEmailtoAdmin((error, info) => {
                                                            if (error) {
                                                                response.send(utils.createError(error))
                                                            }
                                                            else {
                                                                response.send(utils.createSuccess(info))

                                                            }

                                                        })

                                                    }
                                                })
                                            }
                                        })






                                    }
                                })

                            }
                            else {

                                htmlPath = path.join(__dirname, '/../templates/send_activation_link.html')
                                body = '' + fs.readFileSync(htmlPath)
                                body = body.replace('firstName', first_name)
                                body = body.replace('logoLink', logoLink)
                                body = body.replace('activationLink', activationLink)
                                mailer.sendEmail(email, 'Public News Board ', body, (error, info) => {
                                    console.log(error)
                                    console.log(info)
                                    response.send(utils.createResult(error, data))
                                })
                            }


                        }
                    })
                }
            })
        }
    })
});





//sign in
//sign up
/**
 * @swagger
 *
 * /oAuth/signin:
 *   post:
 *     description: For signin of  reader/reporter 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email of reader/reporter
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: password of reader/reporter
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: successful message
 */
router.post('/signin', (request, response) => {
    const { email, password } = request.body
    const statement = `select u.email,c.passwd,u.id,u.first_name,u.last_name,u.isActive,u.isVerified,u.TYPE from user_details u join user_crdntl c  on u.id=c.user_id where u.email ='${email}' and c.passwd='${password}';`

    db.query(statement, (error, users) => {
        if (error) {
            response.send({ status: 'error', error: error })

        } else {

            if (users.length == 0) {
                response.send({ status: 'error', error: 'user does not exist' })
            } else {
                const user = users[0]

                if (user['isVerified'] == 1) {
                    // user is an active user
                    const token = jwt.sign({ id: user['id'], isActive: user['isActive'] }, config.secret)
                    if (user['isActive']) {

                        console.log("user['isVerified']", user['isVerified'])
                        response.send(utils.createResult(error, {
                            first_name: user['first_name'],
                            last_name: user['last_name'],
                            isActive: user['isActive'],
                            type: user['TYPE'],
                            isVerified: user['isVerified'],
                            token: token
                        }))
                    }
                    else {
                        response.send({ status: "success", error: "you are reporter. your account is not active. please contact administrator" })
                    }
                }
                else {
                    // user is a suspended user
                    response.send({ status: 'error', error: 'please verify your email' })
                }




            }
        }
    })


})






module.exports = router
