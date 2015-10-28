var request = require('supertest'),
    assert  = require('assert'),
    app     = require('../../app'),
    pg      = require('pg'),
    seeder  = require('../../db/seed'),
    schema  = require('../../db/schema'),
    agent   = request.agent(app);

describe("product endpoints", function() {
  // beforeEach(function(done) {
  //   schema;
  //   done();

  // })

  // beforeEach(function(done) {
  //   seeder;
  //   done();
  // })

  describe("GET all products", function() {
    var product_request;

    beforeEach(function(done) {
      product_request = agent.get('/product/all').set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      product_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    })

    it("returns products", function() {
      product_request
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 15);
        })
    })


  })

  describe("/search", function() {
    it("finds a product", function() {
      var product_request = agent.get('/search/product/cake').set('Accept', 'application/json');
      product_request
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 3);
          var expected_names = ["Cheesecake", "Commercial cakes and muffins", "Fruit cake"],
              actual_names = [];

          for(var index in result.body) {
            actual_names.push(result.body[index].name)
          }

          assert.deepEqual(expected_names, actual_names);
          done(error);
        })
    })

    it("finds a category", function() {

      var category_request = agent.get('/search/category/Produce').set('Accept', 'application/json');
      category_request
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 2);
          var expected_names = ["Produce", "Produce"],
              actual_names = [];

          for(var index in result.body) {
            actual_names.push(result.body[index].category)
          }

          assert.deepEqual(expected_names, actual_names);
          done(error);

        })
    })

    it("finds a subcategory", function() {
      var subcategory_request = agent.get('/search/subcategory/Fruit').set('Accept', 'application/json');
      subcategory_request
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 1);
          var expected_subcategory = "Fresh Fruits",
              actual_subcategory = result.body[0].subcategory;

          assert.deepEqual(expected_subcategory, actual_subcategory);
          done(error);
        })
    })

    it("finds products with category", function() {
      var category_request = agent.get('/search/categoryproducts/category/Produce').set('Accept', 'application/json');
      category_request
        .expect(200, function(error, result) {
          assert.equal()
        })
    })


  })
  describe("location", function() {
    it("finds products that can be kept in the fridge", function() {
      var fridge_request = agent.get('/fridge').set('Accept', 'application/json');
      fridge_request
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 20);
          var expect_name = "Cheesecake",
              actual_name = result.body[6].name;

          assert.deepEqual(expect_name, actual_name);
          done(error);

        })
    })

    it("finds products that can be frozen", function() {
      var freezer_request = agent.get('/freezer').set('Accept', 'application/json');
      freezer_request
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 20);
          var expect_name = "Cheesecake",
              actual_name = result.body[0].name;

          assert.deepEqual(expect_name, actual_name);
          done(error);
        })
    })

    it("finds products that can be kept in pantry", function() {
      var pantry_request = agent.get('/pantry').set('Accept', 'application/json');
      pantry_request
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 20);
          var expect_name = "Dinners",
              actual_name = result.body[0].name;

          assert.deepEqual(expect_name, actual_name);
          done(error);
        })
    })
  })


})


















