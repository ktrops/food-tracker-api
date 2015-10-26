"use strict";

function Category() {
  this.table_name = "categories";
}

Category.prototype = require('./database');
module.exports = Category;


