const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const config = require('./config')
const app = express()
// router import 
const newsRouter = require('./routes/news/news')
const reporterRouter = require('./routes/reporter/reporter')
const oauthRouter = require('./routes/oAuth')
const adminRouter = require('./routes/admin/admin')

app.use(bodyParser.json())

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
            const data = jwt.verify(token, config.secret)

            // add a new key named userId with logged in reporter's id
            request.userId = data['id']
            console.log(data)
            console.log("isActive " + data['isActive'])

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




app.get('/', (request, response) => {
    response.send('welcome to my application')
})

app.listen(4000, '0.0.0.0', () => {
    console.log('server started on port 4000')
})