const express = require("express");
const expressValidator = require("express-json-validator-middleware");
const ProductService = require("../services/products");
const asyncErrorHandler = require("../asyncErrorHandler");
const ApiError = require("../apiError");

const router = express.Router();
const { validate } = new expressValidator.Validator();

const productSchema = {
  type: "object",
  required: ["name", "type", "inventory"],
  properties: {
    name: {
      type: "string",
    },
    type: {
      type: "string",
      enum: ["book", "gadget", "food", "other"],
    },
    inventory: {
      type: "number",
      minimum: 1,
      maximum: 101,
    },
    description: {
      type: "string",
    },
  },
};

const productTypeSchema = {
  type: "object",
  required: [],
  properties: {
    type: {
      type: "string",
      enum: ["book", "gadget", "food", "other"],
    },
  },
};

router.get(
  "/findAvailableProducts",
  validate({ query: productTypeSchema }),
  asyncErrorHandler(async (req, res) => {
    const pageSize = req.get("pageSize");

    if (!pageSize) {
      throw ApiError.BadRequest("pageSize is required in Headers");
    }

    if (Number.isNaN(Number.parseInt(pageSize))) {
      throw ApiError.BadRequest("pageSize must be a number");
    }

    if (req.query.type === "other" || pageSize > 20) {
      throw ApiError.TimeoutError("Product type was other");
    }

    const products = await ProductService.searchProducts(req.query.type);
    return res.status(200).json(products);
  })
);

router.post(
  "/products",
  validate({ body: productSchema }),
  asyncErrorHandler(async (req, res) => {
    const newProduct = await ProductService.createProduct(req.body);
    return res.status(201).json(newProduct);
  })
);

module.exports = router;
