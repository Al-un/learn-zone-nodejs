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