const express = require('express')
const utils = require('../../utils')
const db = require('../../db')
const fs = require('fs')

const router = express.Router()

// ----------------------------------------------------
// GET
// ----------------------------------------------------

router.get('/image/:filename', (request, response) => {
  const {filename} = request.params
  const file = fs.readFileSync(__dirname + '/../../images/' + filename)
  response.send(file)
})

router.get('/details/:id', (request, response) => {
  const {id} = request.params
  const statement = `
      select p.id, p.title, p.description,
        c.id as categoryId, c.title as categoryTitle,
        b.id as brandId, b.title as brandTitle,
        p.price, p.image, p.isActive from product p
      inner join category c on c.id = p.category
      inner join brand b on b.id = p.brand
      where p.id = ${id}
  `
  db.query(statement, (error, data) => {
    if (error) {
      response.send(utils.createError(error))
    } else {
      // empty products collection
      const products = []

      // iterate over the collection and modify the structure
      for (let index = 0; index < data.length; index++) {
        const tmpProduct = data[index];
        const product = {
          id: tmpProduct['id'],
          title: tmpProduct['title'],
          description: tmpProduct['description'],
          price: tmpProduct['price'],
          isActive: tmpProduct['isActive'],
          brand: {
            id: tmpProduct['brandId'],
            title: tmpProduct['brandTitle']
          },
          category: {
            id: tmpProduct['categoryId'],
            title: tmpProduct['categoryTitle']
          },
          image: tmpProduct['image']
        }
        products.push(product)
      }

      response.send(utils.createSuccess(products))
    }
  })
})

router.get('/', (request, response) => {
  const statement = `
      select p.id, p.title, p.description,
        c.id as categoryId, c.title as categoryTitle,
        b.id as brandId, b.title as brandTitle,
        p.price, p.image, p.isActive from product p
      inner join category c on c.id = p.category
      inner join brand b on b.id = p.brand
  `
  db.query(statement, (error, data) => {
    if (error) {
      response.send(utils.createError(error))
    } else {
      // empty products collection
      const products = []

      // iterate over the collection and modify the structure
      for (let index = 0; index < data.length; index++) {
        const tmpProduct = data[index];
        const product = {
          id: tmpProduct['id'],
          title: tmpProduct['title'],
          description: tmpProduct['description'],
          price: tmpProduct['price'],
          isActive: tmpProduct['isActive'],
          brand: {
            id: tmpProduct['brandId'],
            title: tmpProduct['brandTitle']
          },
          category: {
            id: tmpProduct['categoryId'],
            title: tmpProduct['categoryTitle']
          },
          image: tmpProduct['image']
        }
        products.push(product)
      }

      response.send(utils.createSuccess(products))
    }

  })
})


// ----------------------------------------------------


module.exports = router