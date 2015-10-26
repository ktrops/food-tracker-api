"use strict";

function Products() {
  this.table_name = "products";
}

Products.prototype = require('./database');
module.exports = Products;
