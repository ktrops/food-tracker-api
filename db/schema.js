"use strict";

var pg = require('pg');
var db_env;

if (process.env.NODE_ENV == 'production') {
  db_env = {host: 'aa10otjvdm1imjc.cxwngdtoov1q.us-west-2.rds.amazonaws.com',
            user: 'foodTracker',
            password: '23a1d889ab5d8e574e02737d98c5a2ac5893cca13e315de88df67d9e196c5e6548b33d6a0bf6bd87598d86ef45d933650f3b518a2caf4f83f83f4fa6e2e654c6',
            port: 5432,
            database: 'foodTracker'};
} else {
  db_env = 'postgres://localhost:5432/food_expire_development';
}

var db = new pg.Client(db_env);
db.on('drain', db.end.bind(db));

db.connect();

var drop_categories = db.query('DROP TABLE IF EXISTS categories CASCADE');
var create_categories = db.query('CREATE TABLE categories(id SERIAL PRIMARY KEY, category TEXT, subcategory TEXT)');

var drop_products = db.query('DROP TABLE IF EXISTS products');
var create_products = db.query("CREATE TABLE products(\
                                id SERIAL PRIMARY KEY,\
                                category_id integer REFERENCES categories (id),\
                                category text,\
                                name text,\
                                subname text,\
                                pantry_DOP_min integer,\
                                pantry_DOP_max integer,\
                                pantry_DOP_metric text,\
                                pantry_open_min integer,\
                                pantry_open_max integer,\
                                pantry_open_metric text,\
                                pantry_tips text,\
                                fridge_DOP_min integer,\
                                fridge_DOP_max integer,\
                                fridge_DOP_metric text,\
                                fridge_open_min integer,\
                                fridge_open_max integer,\
                                fridge_open_metric text,\
                                fridge_after_thawing_min integer,\
                                fridge_after_thawing_max integer,\
                                fridge_after_thawing_metric text,\
                                fridge_tips text,\
                                freezer_DOP_min integer,\
                                freezer_DOP_max integer,\
                                freezer_DOP_metric text,\
                                freezer_tips text\
                                )");

db.on(drop_products, function(error) {
  db.on(drop_categories, function(error) {
    db.on(create_categories, function(error) {
      db.on(create_products, function(error) {
        console.log(error);
      })
    })
  })
});

// var count = 4

// function endHandler() {
//   count--;
//   if (count == 0) {
//     db.end();
//   }
// }

// drop_categories.on('end', endHandler);
// create_categories.on('end', endHandler);
// drop_products.on('end', endHandler);
// create_products.on('end', endHandler);


