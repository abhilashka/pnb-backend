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
