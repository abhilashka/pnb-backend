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


const url = `http://localhost:`
const port = `4000`



// ---------------------------------------
//                  GET
// ---------------------------------------

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




// ---------------------------------------
//                  POST
// ---------------------------------------

//sign up
router.post('/signup', (request, response) => {

    const { first_name, last_name, phone, email, password, city, localities, state, pincode, type } = request.body;
    const encryptedPass = crypto.SHA256(password);

    const activationToken = uuid.v4()
    const activationLink = `${url}${port}/oAuth/activate/${activationToken}`
    console.log(activationLink)

    const htmlPath = path.join(__dirname, '/../templates/send_activation_link.html')
    let body = '' + fs.readFileSync(htmlPath)
    body = body.replace('firstName', first_name)
    body = body.replace('activationLink', activationLink)

    const statement1 = `insert into address(city,localities,state,pincode) VALUES('${city}','${localities}','${state}','${pincode}');`


    var isActive = 0;

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

            const statement2 = `insert into user_details(first_name,last_name,address_id,phone,email,TYPE,isActive,activationToken) values('${first_name}','${last_name}',(select id from address where id='${maxId}'),'${phone}','${email}','${type}','${isActive}','${activationToken}');`
            db.query(statement2, (error, data) => {
                if (error) {
                    response.send(utils.createError(error))
                }
                else {

                    const statement = `insert into user_crdntl (user_id,passwd) values ((select id from user_details where email='${email}'),'${password}')`
                    db.query(statement, (error, data) => {
                        if (error) {
                            response.send(utils.createError(error))

                        }
                        else {

                            mailer.sendEmail(email, 'Welcome to mystore', body, (error, info) => {
                                console.log(error)
                                console.log(info)
                                response.send(utils.createResult(error, data))
                            })
                        }
                    })
                }
            })
        }
    })
});





//sign in
router.post('/signin', (request, response) => {
    const { email, password } = request.body
    const statement = `select u.email,c.passwd,u.id,u.first_name,u.last_name,u.isActive,u.isVerified from user_details u join user_crdntl c  on u.id=c.user_id where u.email ='${email}' and c.passwd='${password}';`

    db.query(statement, (error, users) => {
        if (error) {
            response.send({ status: 'error', error: error })

        } else {
            console.log(users);
            if (users.length == 0) {
                response.send({ status: 'error', error: 'user does not exist' })
            } else {
                const user = users[0]

                if (user['isVerified'] == 1) {
                    // user is an active user
                    const token = jwt.sign({ id: user['id'], isActive: user['isActive'] }, config.secret)
                    if (user['isActive']) {

                        response.send(utils.createResult(error, {
                            first_name: user['first_name'],
                            last_name: user['last_name'],
                            isActive: user['isActive'],
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
