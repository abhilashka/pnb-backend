const express = require('express')

const utils = require('../../utils')
const db = require('../../db')
const router = express.Router()


const crypto = require('crypto-js')
const jwt = require('jsonwebtoken')
const utils = require('../../utils')
const db = require('../../db')
const multer = require('multer')
const upload = multer({ dest: 'images/' })
const router = express.Router()


// ---------------------------------------
//                  GET
// ---------------------------------------


router.get('/test', (req, res) => {
  const statement = `select * from news`
  db.query(statement, (error, data) => {
    if (error) {
      res.send(utils.createError(error))
      console.log(`error`)
    }
    else {
      res.send(utils.createSuccess(data))
      console.log(`data`)
    }
  })

})




// ----------------------------------------------------
// POST
// ----------------------------------------------------


//sign up
router.post('/signup', (request, response) => {
  const { firstName, lastName, email, password } = request.body

  const encryptedPassword = crypto.SHA256(password)

  //change query accroding to our db 
  const statement = `insert into admin (firstName, lastName, email, password) values (
    '${firstName}', '${lastName}', '${email}', '${encryptedPassword}'
  )`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})


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




router.post('/createnews', (request, response) => {
  const { title, description, category, price, brand } = request.body

  const statement = `insert into product (title, description, category, price, brand) values (
    '${title}', '${description}', '${category}', '${price}', '${brand}'
  )`

  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })

})






router.post('/upload-image', upload.single('articleImage'), (request, response) => {
  // const { productId } = request.params
  const { title, description } = request.body

  const fileName = request.file.filename

  const statement = `insert into news(title,description,image) values('${title}', '${description}','${fileName}'); `
  console.log(statement)
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})






module.exports = router



