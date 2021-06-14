// Importing the packages required for the project.  
  
const mysql = require('mysql');  
const express = require('express');  
var app = express();  

router.get('/test', (req, res) => {
    const statement = `select * from category`
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
  
    const statement = `insert into news (title, description ) values (
      '${title}', '${description}'
    )`
  
    db.query(statement, (error, data) => {
      response.send(utils.createResult(error, data))
    })
  
  })
  
  const { title, description, category, } = request.body
  `insert into news(title ,description, category, address) values {'${title}', '${description}','${address}' }`
  
  module.exports = router