const express = require('express')
const utils = require('../../utils')
const db = require('../../db')
const router = express.Router()

// ----------------------------------------------------
// GET
// ----------------------------------------------------

/**
 * @swagger
 *
 * /brand:
 *   get:
 *     description: For getting list of brands
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful message
 */
router.get('/', (request, response) => {
  const statement = `select id, title, description from brand`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})

// ----------------------------------------------------



// ----------------------------------------------------
// POST
// ----------------------------------------------------

router.post('/', (request, response) => {
  const {title, description} = request.body
  const statement = `insert into brand (title, description) values ('${title}', '${description}')`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})

// ----------------------------------------------------


// ----------------------------------------------------
// PUT
// ----------------------------------------------------

router.put('/:id', (request, response) => {
  const {id} = request.params
  const {title, description} = request.body
  const statement = `update brand set title = '${title}', description = '${description}' where id = ${id}`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})

// ----------------------------------------------------



// ----------------------------------------------------
// DELETE
// ----------------------------------------------------

router.delete('/:id', (request, response) => {
  const {id} = request.params
  const statement = `delete from brand where id = ${id}`
  db.query(statement, (error, data) => {
    response.send(utils.createResult(error, data))
  })
})

// ----------------------------------------------------

module.exports = router