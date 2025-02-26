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

/**
 * @openapi
 * /orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Create a new order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/orders",
  validate({ body: orderSchema }),
  asyncErrorHandler(async (req, res) => {
    const newOrder = await orderService.createOrder(req.body);
    return res.status(201).json(newOrder);
  })
);

module.exports = router;
