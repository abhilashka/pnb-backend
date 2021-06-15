
const express = require('express')

const crypto = require('crypto-js')
const jwt = require('jsonwebtoken')
const utils = require('../../utils')
const db = require('../../db')
const config = require('../../config')
const bodyParser = require('body-parser')
const router = express.Router()

// parse application/json
router.use(bodyParser.json());

// ---------------------------------------
//                  GET
// ---------------------------------------


//get all news
router.post('/addnews', (request, response) => {
    const statement = `select header_id, content, headline from news_details;`
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


// ----------------------------------------------------
  // POST
  // ----------------------------------------------------
  router.post('/createnews', (request, response) => {
    const { header_id, content, headline } = request.body
    const statement = 'select a.id from user_details u join address a on u.id=a.id where a.id=u.address_id;'
    db.query(statement, (error, data) => {})
 //--insert into news_header
const statement2 = `insert into news_header(reporter_id, address_id) VALUES(rpt_id,select a.id from user_details u join 
  address a on u.id=a.id where a.id=u.address_id);`
  db.query(statement2, (error, data) => {})
    
  const stm = `select Max(id) as Maxid from news_header`
  var news_header_id;
  db.query(stm, (error, data) => {
    if(error){
 
         }
         else{
           news_header_id = data[0].Maxid+1
         }
         const statement3 = `insert into news_details (header_id, content, headline ) values ( SELECT id from news_header where id='${news_header_id}' )`

       db.query(statement3, (error, data) => {
           if(error){
        response.send(utils.createError(error))
   
           }
           else{
        response.send(utils.createSuccess(data))
           }
       })
   })
  
  })
  module.exports = router 
       
       
       