var express = require('express');
var path = require('path');
var logger = require('morgan');

var productsRouter = require('./routes/product');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', productsRouter);

module.exports = app;
