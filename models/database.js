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


module.exports = {


  find_all: function(callback) {
    var db = new pg.Client(db_env);
    db.on('drain', db.end.bind(db));
    db.connect();
    db.query("SELECT * FROM " + this.table_name + ";", function(error, result) {
      callback(error, result.rows);
    })
  },

  find_by_fuzzy: function(column, value, callback) {
    var db = new pg.Client(db_env);
    db.on('drain', db.end.bind(db));
    db.connect();
    var likeValue = "%" + value + "%";
    console.log("I'm in find_by ", column + " " + likeValue);
    db.query("SELECT * FROM " + this.table_name + " WHERE " + column + " like $1" + ";", [likeValue], function(error, result) {
      // console.log(error);
      // console.log(result.rows);
      callback(error, result.rows);
    })
  },

  find_by: function(column, value, callback) {
    var db = new pg.Client(db_env);
    db.on('drain', db.end.bind(db));
    db.connect();
    db.query("SELECT * FROM " + this.table_name + " WHERE " + column + " = $1" + ";", [value], function(error, result) {
      // console.log(result.rows);
      callback(error, result.rows);
    })
  },

  pantry: function(callback) {
    var db = new pg.Client(db_env);
    db.on('drain', db.end.bind(db));
    db.connect();
    db.query("SELECT * FROM products WHERE pantry_dop_min != 0 OR pantry_open_min != 0 OR pantry_tips != '';", function(error, result) {
      callback(error, result.rows);
    })
  },

  fridge: function(callback) {
    var db = new pg.Client(db_env);
    db.on('drain', db.end.bind(db));
    db.connect();
    db.query("SELECT * FROM products WHERE fridge_dop_min != 0 OR fridge_open_min != 0 OR fridge_tips != '' OR fridge_after_thawing_min != 0;", function(error, result) {
      callback(error, result.rows);
    })
  },

  freezer: function(callback) {
    var db = new pg.Client(db_env);
    db.on('drain', db.end.bind(db));
    db.connect();
    db.query("SELECT * FROM products WHERE freezer_dop_min != 0 OR freezer_tips != '' ", function(error, result) {
      callback(error, result.rows);
    })
  }


}
















