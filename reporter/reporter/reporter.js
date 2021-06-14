const express = require('express')
const utils = require('../utils')
const db = require('../db')
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



router.post('/createnews', (request, response) => {
  const { title, description, category, price, brand } = request.body

  const statement = `insert into product (title, description, category, price, brand) values (
    '${title}', '${description}', '${category}', '${price}', '${brand}'
  )`

  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })

})



module.exports = router