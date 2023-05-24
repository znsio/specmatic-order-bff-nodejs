const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/findAvailableProducts', function (req, res, next) {
    axios
        .get('http://localhost:9000/products?type=' + req.query.type)
        .then(apiRes => {
            console.log(apiRes.data);
            res.send(apiRes.data);
        })
        .catch(err => console.log('Error: ', err.message));
});

router.post('/createOrder', function (req, res, next) {
    axios.post('http://localhost:9000/orders', req.body)
        .then((apiRes) => {
            res.send({ status: true });
        })
        .catch(err => {
            console.log('Error: ', err.message);
            res.send({ status: false });
        });
});

module.exports = router;
