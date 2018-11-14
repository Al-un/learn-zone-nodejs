// .env loading: 
// https://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

// App config
const PORT = process.env.PORT || 3000;

// Express
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

// Routing
const routes = require('./src/routes')
app.use('/', routes)

// Run
app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`)
})