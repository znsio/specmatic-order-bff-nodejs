const express = require('express')

const productsRouter = require('./routes/product')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', productsRouter)

app.all('*', function (req, res) {
    res.status(404).json({
        error: `route ${req.url} not found`,
    })
})

module.exports = app
