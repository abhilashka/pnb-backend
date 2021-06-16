
const express = require('express')
const bodyParser = require('body-parser')

const crypto = require('crypto-js')
const jwt = require('jsonwebtoken')
const utils = require('../../utils')
const db = require('../../db')
const config = require('../../config')
const multer = require('multer')
const upload = multer({ dest: 'images/' })

const router = express.Router()

// parse application/json
router.use(bodyParser.json());




// ---------------------------------------
//                  POST
// ---------------------------------------




router.post('/addnews', upload.single('articleImage'), (request, response) => {
    const { content, headline } = request.body;

    const userid = request.userId
    const fileName = request.file.filename

    const statement1 = `insert into news_header(reporter_id, address_id,image) VALUES('${userid}', (select address_id from user_details where id='${userid}'),'${fileName}');`

    db.query(statement1, (error, data) => {
        if (error) {
            response.send(utils.createError(error))
        }
        else {
            const stm = `SELECT MAX(id) AS MaxId FROM news_header`;
            var maxId = 0;
            db.query(stm, (error, data) => {
                if (error) {
                    response.send(utils.createError(error))

                }
                else {
                    maxId = data[0].MaxId;
                    const statement2 = `insert into news_details(header_id,content,headline) VALUES('${maxId}','${content}','${headline}' );`
                    db.query(statement2, (error, data) => {
                        if (error) {
                            response.send(utils.createError(error))

                        }
                        else {
                            response.send(utils.createSuccess(data));


                        }
                    })
                }
            })
        }
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




// ---------------------------------------
//                  GET
// ---------------------------------------





module.exports = router

