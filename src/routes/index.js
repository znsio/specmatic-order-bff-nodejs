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

module.exports = router;
