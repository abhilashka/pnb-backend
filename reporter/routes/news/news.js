
// Importing the packages required for the project.  
const express = require('express')
const utils = require('../../utils')
const db = require('../../db')
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
=======
const express = require('express')

const crypto = require('crypto-js')
const jwt = require('jsonwebtoken')
const utils = require('../../utils')
const db = require('../../db')
const config = require('../../config')
const multer = require('multer')
const upload = multer({ dest: 'images/' })

const router = express.Router()

// ---------------------------------------
//                  POST
// ---------------------------------------






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

