const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const config = require('./config')
const cors = require('cors')

// morgan: for logging
const morgan = require('morgan')

// swagger: for api documentation
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')


// routers
const adminRouter = require('./admin/routes/admin')
const brandRouter = require('./admin/routes/brand')
const categoryRouter = require('./admin/routes/category')
const orderRouter = require('./admin/routes/order')
const productRouter = require('./admin/routes/product')
const reviewRouter = require('./admin/routes/review')
const userRouter = require('./admin/routes/user')

const app = express()
app.use(cors('*'))

app.use(bodyParser.json())
app.use(morgan('combined'))

// swagger init
const swaggerOptions = {
  definition: {
    info: {
      title: 'Amazon Server (Admin Panel)',
      version: '1.0.0',
      description: 'This is a Express server for amazon application'
    }
  },
  apis: ['./admin/routes/*.js']
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// add a middleware for getting the id from token
function getUserId(request, response, next) {

  if (request.url == '/admin/signin' 
      || request.url == '/admin/signup'
      || request.url.startsWith('/product/image') ) {
    // do not check for token 
    next()
  } else {

    try {
      const token = request.headers['token']
      const data = jwt.verify(token, config.secret)

      // add a new key named userId with logged in user's id
      request.userId = data['id']

      // go to the actual route
      next()
      
    } catch (ex) {
      response.status(401)
      response.send({status: 'error', error: 'protected api'})
    }
  }
}

app.use(getUserId)

// required to send the static files in the directory named images
app.use(express.static('images/'))

// add the routes
app.use('/admin', adminRouter)
app.use('/brand', brandRouter)
app.use('/category', categoryRouter)
app.use('/order', orderRouter)
app.use('/product', productRouter)
app.use('/review', reviewRouter)
app.use('/user', userRouter)

// default route
app.get('/', (request, response) => {
  response.send('welcome to my application')
})

app.listen(3000, '0.0.0.0', () => {
  console.log('server started on port 3000')
})