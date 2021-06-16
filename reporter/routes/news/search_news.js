

const express = require('express')
const bodyParser = require('body-parser')


const utils = require('../../utils')
const db = require('../../db')



const router = express.Router()

// parse application/json
router.use(bodyParser.json());


router.get('/newssearch', (request, response) => {
    const {
        city,
        localities,
        state,
        pincode,
        header,
      } = request.body;
    
    const statement = `SELECT n.category,det.headline,det.content
    FROM news_header n
    INNER JOIN address ON n.address_id = address.id 
    INNER JOIN news_details det ON n.id=det.header_id where det.headline ='best politics' or address.city ='' or address.localities = 'Boatclub' or address.state='' ;`
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
