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





module.exports = router