// Importing the packages required for the project.  
const express = require('express')
const utils = require('../utils')
const db = require('../db')
const router = express.Router()  
const bodyParser = require('body-parser');
const { networkInterfaces } = require('os');
const request = express.request;

// parse application/json
router.use(bodyParser.json());
 

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
    const { title, description } = request.body
  
    const statement = `insert into news (title, description ) values ( '${title}', '${description}')`
    db.query(statement, (error, data) => {
        if(error){
     response.send(utils.createError(error))

        }
        else{
     response.send(utils.createSuccess(data))
        }
    })
  
  })
  


  module.exports = router