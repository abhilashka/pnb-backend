const express = require('express')
const utils = require('../../utils')
const db = require('../../db')
const crypto = require('crypto-js')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const multer = require('multer')
const upload = multer({ dest: 'images/' })
const path = require('path')
const fs = require('fs')
const mailer = require('../../mailer')



const router = express.Router()


// ---------------------------------------
//                  GET
// ---------------------------------------







// ----------------------------------------------------
// POST
// ----------------------------------------------------


//sign up
router.post('/signup', (request, response) => {
  // const statement1 = 'insert into address(city,localities,town,pincode) VALUES("pune","pune","pune",1234);'
  
  const { first_name,last_name,phone,email,password,city,localities,state,pincode,type} = request.body;
  // const encryptedPass = crypto.SHA256(password);

  const stm=`SELECT MAX(id) AS MaxId FROM address`;
  var maxId;
  db.query(stm,(error, data) => {
    if (error) {
      console.log(error)
    }    
    else {
      console.log(data[0].MaxId);
      maxId=data[0].MaxId;
    }
  })

  const statement1 = `insert into address(city,localities,state,pincode) VALUES('${city}','${localities}','${state}','${pincode}');`
  

  db.query(statement1, (error, data) => {

  })
  const statement2 = `insert into user_details(first_name,last_name,address_id,phone,email,TYPE) values('${first_name}','${last_name}',(select id from address where pincode='${maxId}'),'${phone}','${email}','${type}');`
  db.query(statement2, (error, data) => {
    if (error) {
      console.log(error)
    }
    else {
      console.log(data)

    }

  })
  const statement = `insert into user_crdntl (user_id,passwd) values ((select id from user_details where email='${email}'),'${password}')`
  db.query(statement, (error, data) => {
    if (error) {
      response.send(utils.createError(error))

    }
    else {
      response.send(utils.createSuccess(data));


    }
  })
});





  // // const statement = `insert into reporter (reporter_detail) values ((select id from person_details where email="steven3@gmail.com"))`
  // const statement = `select * from news;`
  // db.query(statement, (error, data) => {
  //   if (error) {
  //     response.send(utils.createError(error))

  //   }
  //   else {

  //     mailer.sendEmail(email, 'Public News Board', body, (error, info) => {

  //       response.send(utils.createSuccess(data))

  //     })


    // }

//     const { firstName, lastName, email, password } = request.body

//     const encryptedPassword = crypto.SHA256(password)

//     //change query accroding to our db 
//     const statement = `insert into admin (firstName, lastName, email, password) values (
//     '${firstName}', '${lastName}', '${email}', '${encryptedPassword}'
//   )`
//     db.query(statement, (error, data) => {
//       response.send(utils.createResult(error, data))

//     })
//   })

// })



//sign in
router.post('/signin', (request, response) => {
  const { email, password } = request.body
  const statement = `select r.id,p.first_name,p.last_name from reporter r join person_details p on p.id=r.id

                     where email = '${email}' and password = '${crypto.SHA256(password)}'`


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
