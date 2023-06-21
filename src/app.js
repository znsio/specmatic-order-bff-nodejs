var express = require('express');
var path = require('path');
var logger = require('morgan');

var productsRouter = require('./routes/product');
var emailRouter = require('./routes/email');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', productsRouter);
app.use('/email', emailRouter);

module.exports = app;
