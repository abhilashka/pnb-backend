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

const app = express()
app.use(cors('*'))

app.use(bodyParser.json())
app.use(morgan('combined'))

// router import 
const newsRouter = require('./routes/news/news')
const reporterRouter = require('./routes/reporter/reporter')
const oauthRouter = require('./routes/oAuth')
const adminRouter = require('./routes/admin/admin')


var options = {
    swaggerOptions: {
        authAction: { JWT: { name: "JWT", schema: { type: "apiKey", in: "header", name: "Authorization", description: "" }, value: "Bearer <JWT>" } }
    }
};

// swagger init
const swaggerOptions = {
    definition: {
        info: {
            title: 'Public News Board Server ',
            version: '1.0.0',
            description: 'This is a Express server for Public News Board application'
        }
    },
    apis: [
        './routes/admin/*.js',
        './routes/news/*.js',
        './routes/oAuth.js'
    ]

}
const swaggerSpec = swaggerJSDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, options));

function getuserId(request, response, next) {

    if (request.url == '/oAuth/signin'
        || request.url == '/oAuth/signup'
        || request.url == '/admin/signin'
        || request.url.startsWith('/oAuth/activate')
        || request.url == '/logo.png'
        || request.url.startsWith('/product/image/')
        || request.url.startsWith('/oAuth/forgot-password')) {
        // do not check for token 
        next()
    } else {

        try {
            const token = request.headers['token']
            console.log("||request.url.startsWith -> token", token)
            const data = jwt.verify(token, config.secret)
            console.log("||request.url.startsWith -> data", data)

            // add a new key named userId with logged in reporter's id
            request.userId = data['id']


            if (data['isActive']) {
                next()

            }
            else {
                response.send({ status: 'success', error: 'you dont have access' })
            }
            console.log('reporter id: ' + request.userId)
            // go to the actual route

        } catch (ex) {
            response.status(401)
            response.send({ status: 'error', error: 'protected api' })
        }
    }
}

app.use(getuserId)



app.use('/reporter', reporterRouter)
app.use('/news', newsRouter)
app.use('/oAuth', oauthRouter)
app.use('/admin', adminRouter)



// default route
app.get('/', (request, response) => {
    response.send('welcome to Public News Board application')
})

app.listen(4000, '0.0.0.0', () => {
    console.log('server started on port 4000')
})