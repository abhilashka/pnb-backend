const express = require('express')
const bodyParser = require('body-parser')

const newsRouter = require('./routes/news/news')

const reporterRouter = require('./routes/reporter/reporter')
const newsSearch = require('./routes/news/search_news')
const jwt = require('jsonwebtoken')

const app = express()
app.use(bodyParser.json())

function getreporterId(request, response, next) {

    if (request.url == '/reporter/signin'
        || request.url == '/reporter/signup'
        || request.url.startsWith('/reporter/activate')
        || request.url == '/logo.png'
        || request.url.startsWith('/product/image/')
        || request.url.startsWith('/reporter/forgot-password')) {
        // do not check for token 
        next()
    } else {

        try {
            const token = request.headers['token']
            const data = jwt.verify(token, config.secret)

            // add a new key named reporterId with logged in reporter's id
            request.reporterId = data['id']
            console.log('reporter id: ' + request.reporterId)
            // go to the actual route
            next()

        } catch (ex) {
            response.status(401)
            response.send({ status: 'error', error: 'protected api' })
        }
    }
}

app.use(getreporterId)



app.use('/reporter', reporterRouter)

app.use('/news', newsRouter)

app.use('/newssearch',newsSearch)




app.get('/', (request, response) => {
    response.send('welcome to my application')
})

app.listen(4000, '0.0.0.0', () => {
    console.log('server started on port 4000')
})