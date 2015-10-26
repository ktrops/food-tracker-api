"use strict";

var Product = require("../models/products");
var Category = require("../models/categories");
String.prototype.capitalize = function() {
    this.toLowerCase();
    return this.charAt(0).toUpperCase() + this.slice(1);
}

exports.endpointsController = {

  getAllCategories: function(req, res) {
    var dbCategory = new Category();
    dbCategory.find_all(function(error, result) {
      res.status(200).json(result);
    })
  },

  getAllProducts: function(req, res) {
    var dbProduct = new Product();
    dbProduct.find_all(function(error, result) {
      res.status(200).json(result);
    })
  },

  findCategoryByName: function(req, res) {
    var dbCategory = new Category();
    var name = req.params.category
    var capName = name.capitalize
    dbCategory.find_by_fuzzy("category", name, function(error, result) {
      res.status(200).json(result);
    })
  },

  findProductByName: function(req, res) {
    var dbProduct = new Product();
    var name = req.params.product;
    dbProduct.find_by_fuzzy("name", name, function(error, result) {
      res.status(200).json(result);
    })
  },

  findSubCategoryByName: function(req, res) {
    var dbCategory = new Category();
    var subCat = req.params.subcategory;
    dbCategory.find_by_fuzzy("subcategory", subCat, function(error, result) {
      res.status(200).json(result);
    })
  },

  findAllProductsForCategory: function(req, res) {
    var dbCategory = new Category();
    var category = req.params.categoryname;
    var column = req.params.categorytype;
    var products = [];
    dbCategory.find_by_fuzzy(column, category, function(error, category_result){
      for (var i = 0; i < category_result.length; i++) {
        var category_id = category_result[i].id
        console.log("I'm the category_id ", category_id);
        var dbProduct = new Product();
        dbProduct.find_by("category_id", category_id, function(error, result) {
          products.push(result);
          // console.log(result);
          console.log("I'm the products ", products);
          res.status(200).json(products[0]);
        })
      }
    })
  },

  findPantryProducts: function(req, res) {
    var dbProduct = new Product();
    dbProduct.pantry(function(error, result) {
      res.status(200).json(result);
    })
  },

  findFridgeProducts: function(req, res) {
    var dbProduct = new Product();
    dbProduct.fridge(function(error, result) {
      res.status(200).json(result);
    })
  },

  findFreezerProducts: function(req, res) {
    var dbProduct = new Product();
    dbProduct.freezer(function(error, result) {
      res.status(200).json(result);
    })
  }

}












