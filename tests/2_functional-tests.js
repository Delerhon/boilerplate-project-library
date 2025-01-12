/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  /* test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  }); */
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {

      test('#1 Test POST /api/books with title', function(done) {
        chai.request(server).delete('/api/books')
          .end( (err, res) => {
            chai
              .request(server)
              .post('/api/books')
              .send({ title: 'TestBook1'})
              .end( (req, res) => {
                const r = res.body
                assert.equal(res.status, 200)
                assert.isObject(r)
                assert.property(r, 'title')
                assert.property(r, '_id')
                done();
            })
        })
      });
      
      test('#2 Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .send({ title: ''})
          .end( (req, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'missing required field title', 'Missing title response should be "missing required field title"')
            done()
        })
      });      
    });


    suite('GET /api/books => array of books', function(){
      
      test('#3 Test GET /api/books',  function(done){
        chai.request(server).post('/api/books').send({ title: 'TestBook2' })
          .end( (err, res) => {
            chai
              .request(server)
              .get('/api/books')
              .end( (err, res) => {
                assert.equal(res.status, 200)
                assert.isArray(res.body, "Body should be an Array");
                assert.equal(res.body.length, 2, 'Array should have a length of 2')
                done()
              })
          })
      });      
      
    }); 


     suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .get('/api/books/564165161w6e')
          .end( (err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'no book exists')
            done()
          })
      });
      
       test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server).get('/api/books')
          .end( (err, res) => {
            chai
              .request(server)
              .get(`/api/books/${res.body["0"]._id}`)
              .end( (err, res) => {
                assert.equal(res.status, 200)
                assert.isObject(res.body, "should be an Object");
                assert.propertyVal(res.body, 'title', 'TestBook1', 'Book should be "TestBook1"')
                done()
              })
          })
      }); 
      
    }); 


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server).get('/api/books')
        .end( (err, res) => {
          chai
            .request(server)
            .post(`/api/books/${res.body["1"]._id}`)
            .send({ comment: 'testComment1'})
            .end( (err, res) => {
              assert.equal(res.status, 200)
              assert.isObject(res.body)
              assert.propertyVal(res.body, 'title', 'TestBook2')
              assert.property(res.body, 'comments')
              assert.equal(res.body.comments[0], 'testComment1');
              done()
            })
        });
      })

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server).get('/api/books')
        .end( (err, res) => {
          chai
            .request(server)
            .post(`/api/books/${res.body["1"]._id}`)
            .end( (err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.text, 'missing required field comment')
              done()
            })
        }); 
      })

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
          .request(server)
          .post(`/api/books/18961891wec891`)
          .send({ comment: 'testComment1'})
          .end( (err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'no book exists')
            done()
          })
      });       

      
    }); 

     suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server).get('/api/books')
        .end( (err, res) => {
          chai
            .request(server)
            .delete(`/api/books/${res.body[0]._id}`)
            .end( (err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.text, 'delete successful')
              done()
            })
        })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server).get('/api/books')
        .end( (err, res) => {
          chai
            .request(server)
            .delete(`/api/books/189111891981dcghn`)
            .end( (err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.text, 'no book exists')
              chai.request(server).delete('/api/books').end()
              done()
            })
        })    
      });  

    }); 

  });

});
