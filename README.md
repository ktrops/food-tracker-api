#Food Tracker API

This is a node.js app that seeds a database from a CSV file from the USDA.

###Endpoints:

####/category/all
Gets all of the different types of categories.

####/product/all
Gets all of the products.

####/search/category/:category
Get all products for category.

####/search/product/:product
Get a specific product.

####/search/subcategory/:subcategory
Get all products associated with a subcategory.

####/pantry
Get all products that can go in the pantry.

####/fridge
Get all products that can go in the fridge.

####/freezer
Get all products that can go in the freezer.

####/search/categoryproducts/:categorytype/:categoryname
