var express = require('express');
var router = express.Router();
var endpoint_exports = require('../controllers/endpoints');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/category/all', function(req, res, next) {
  endpoint_exports.endpointsController.getAllCategories(req, res);
});

router.get('/product/all', function(req, res, next) {
  endpoint_exports.endpointsController.getAllProducts(req, res);
});

router.get('/search/category/:category', function(req, res, next) {
  endpoint_exports.endpointsController.findCategoryByName(req, res);
});

router.get('/search/product/:product', function(req, res, next) {
  endpoint_exports.endpointsController.findProductByName(req, res);
});

router.get('/search/subcategory/:subcategory', function(req, res, next) {
  endpoint_exports.endpointsController.findSubCategoryByName(req, res);
});

router.get('/search/categoryproducts/:categorytype/:categoryname', function(req, res, next) {
  endpoint_exports.endpointsController.findAllProductsForCategory(req, res);
});

router.get('/pantry', function(req, res, next) {
  endpoint_exports.endpointsController.findPantryProducts(req, res);
});

router.get('/fridge', function(req, res, next) {
  endpoint_exports.endpointsController.findFridgeProducts(req, res);
});

router.get('/freezer', function(req, res, next) {
  endpoint_exports.endpointsController.findFreezerProducts(req, res);
});

module.exports = router;









