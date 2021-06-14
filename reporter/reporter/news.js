const express = require('express')
const db = require('../db')
const utils = require('../utils')
const router = express.Router()


//get all news
router.get('/', (request, response) => {
  const statement = `select title, description, date from news;`
  db.query(statement, (error, data) => {
    if (error) {
        response.send(utils.createError(error))
        console.log(`error`)
      }
      else {
        response.send(utils.createSuccess(data))
        console.log(`data`)
      }
  })
})


// Towns/Cities/localities
router.get('/:newsid', (request, response) => {
    const { newsid } = request.params
    const statement = `SELECT news.description, address.city
    FROM news
    INNER JOIN address ON news.id = address.id where news.id = ${newsid} and address.id = ${newsid};`
    db.query(statement, (error, data) => {
      if (error) {
          response.send(utils.createError(error))
          console.log(`error`)
        }
        else {
          response.send(utils.createSuccess(data))
          console.log(`data`)
        }
    })
  })


module.exports = router