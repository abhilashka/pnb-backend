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


// ---------------------------------------
//                  GET
// ---------------------------------------


//get all news
router.get('/', (request, response) => {
    const statement = `SELECT headline,content FROM pnb.news_details;;`
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


//Towns/Cities/localities
router.get('/getnews', (request, response) => {
        let id= request.reporterId
        const statement = `SELECT news_details.headline, news_details.content,address.city
        FROM news_details
        INNER JOIN address ON news_details.id = address.id where news_details.id = ${id} and address.id = ${id};`
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

