// AUTH CREATE
const createAuth = require("./auth/create.js");
exports.create = createAuth;

// DELETE
const deleteProduct = require("./delete-product.js");
exports.deleteProduct = deleteProduct;

// GET
const getProduct = require("./get-product.js");
exports.getProduct = getProduct;

// EDIT
const editProduct = require("./edit/edit-product.js");
exports.editProduct = editProduct;
