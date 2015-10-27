var request = require('supertest'),
    assert  = require('assert'),
    app     = require('../../app'),
    pg      = require('pg'),
    seeder  = require('../../db/seed'),
    schema  = require('../../db/schema'),
    agent   = request.agent(app);

describe("product endpoints", function() {
  // beforeEach(function(done) {
  //   schema(done)
  // })

  // beforeEach(function(done) {
  //   seeder(done)
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

  describe("/product", function() {
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

    it("finds a product", function() {
      var product_request = agent.get('/product/cake').set('Accept', 'application/json');
      product_request
        .expect(200, function(error, result) {
          assert.equal
        })

    })


  })

})


















