
const express = require('express')
const bodyParser = require('body-parser')
const reporetRouter = require('./reporter/reporter')
const newsRouter = require('./reporter/news')
const app = express()
app.use(bodyParser.json())

app.use('/reporter', reporetRouter)
app.use('/news', newsRouter)


app.get('/', (request, response) => {
    response.send('welcome to my application')
})

app.listen(4000, '0.0.0.0', () => {
    console.log('server started on port 4000')
})