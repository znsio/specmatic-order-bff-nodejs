const express = require("express");
const expressValidator = require("express-json-validator-middleware");
const orderService = require("../services/order");

const router = express.Router();
const asyncErrorHandler = require("../asyncErrorHandler");

const { validate } = new expressValidator.Validator();

const orderSchema = {
  type: "object",
  required: ["productid", "count"],
  properties: {
    productid: {
      type: "number",
    },
    count: {
      type: "number",
    },
  },
};

router.post(
  "/orders",
  validate({ body: orderSchema }),
  asyncErrorHandler(async (req, res) => {
    const newOrder = await orderService.createOrder(req.body);
    return res.status(201).json(newOrder);
  })
);

module.exports = router;
