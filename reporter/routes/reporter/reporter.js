const express = require('express')
const utils = require('../../utils')
const db = require('../../db')
const crypto = require('crypto-js')
const jwt = require('jsonwebtoken')
const config = require('../../config')

const router = express.Router()


// ---------------------------------------
//                  GET
// ---------------------------------------







// ----------------------------------------------------
// POST
// ----------------------------------------------------


//sign up
router.post('/signup', (request, response) => {


  const { first_name, last_name, phone, email, password, city, localities, state, pincode, type } = request.body;




  const encryptedPass = crypto.SHA256(password);


  const statement1 = `insert into address(city,localities,state,pincode) VALUES('${city}','${localities}','${state}','${pincode}');`


  db.query(statement1, (error, data) => {

  })

  const stm = `SELECT MAX(id) AS MaxId FROM address`;
  var maxId = 0;
  db.query(stm, (error, data) => {
    if (error) {
      console.log(error)
    }
    else {
      console.log(data[0].MaxId);
      maxId = data[0].MaxId + 1;
      const statement2 = `insert into user_details(first_name,last_name,address_id,phone,email,TYPE) values('${first_name}','${last_name}',(select id from address where id='${maxId}'),'${phone}','${email}','${type}');`
      db.query(statement2, (error, data) => {
        if (error) {
          console.log(error)
        }
        else {

          const statement = `insert into user_crdntl (user_id,passwd) values ((select id from user_details where email='${email}'),'${password}')`
          db.query(statement, (error, data) => {
            if (error) {
              response.send(utils.createError(error))

            }
            else {
              response.send(utils.createSuccess(data));


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
  const statement = `select u.email,c.passwd,u.id,u.first_name,u.last_name from user_details u join user_crdntl c  on u.id=c.id where u.email ='${email}' and c.passwd='${password}';`


  db.query(statement, (error, reporters) => {
    if (error) {
      response.send({ status: 'error', error: error })
    } else {
      if (reporters.length == 0) {
        response.send({ status: 'error', error: 'reporter does not exist' })
      } else {
        const reporter = reporters[0]

        const token = jwt.sign({ id: reporter['id'] }, config.secret)
        response.send(utils.createResult(error, {
          first_name: reporter['first_name'],
          last_name: reporter['last_name'],
          token: token
        }))
      }
    }
  })
})




module.exports = router
