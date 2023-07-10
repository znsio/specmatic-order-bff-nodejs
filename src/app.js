const express = require('express')
const logger = require('morgan')
const specmaticUtil = require('specmatic-util')

const productsRouter = require('./routes/product')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', productsRouter)

//Important: Add below line for specmatic test api coverage
//           This exposes end "/_specmaitc/endpoints" endpoint only in test mode (via process.env.NODE_ENV)
specmaticUtil.enableApiCoverage(app)

app.all('*', function (req, res) {
    res.status(404).json({
        error: `route ${req.url} not found`,
    })
})

module.exports = app
