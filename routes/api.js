/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
const Book = require('../Schema/books.js');
const { response } = require('express');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find().select({_id: 1, title: 1, commentcount: 1, comments: 1}).exec()
        .then(  (results)   => { buildResultAndSend(results, res) })
        .catch( (error)     => { res.json({ error: 'message' }) })
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      const title = req.body.title

      Book.create({ title })
        .then(  (result)  => { res.json({ _id: result._id, title }) })
        .catch( (error)   => { res.send('missing required field title') })
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      Book.find().deleteMany().exec()
      .then(  (result)  => { res.send('complete delete successful') })
      .catch( (error)   => { res.json('error onDeleteAll') })
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let _id = req.params.id

      findOneAndSend(_id, res);
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let _id = req.params.id;
      let comments = req.body.comment;
      if (!comments) { res.send('missing required field comment') }
      else {
        Book.findOneAndUpdate({ _id }, { $push: { comments: comments } }, { new: true} )
          .then(  (result)  => { findOneAndSend(result._id, res) })
          .catch( (error)   => { res.send('no book exists') })
      }
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let _id = req.params.id;

      Book.findByIdAndRemove(_id)
        .then(  (result)  => { 
          if (result) {res.send('delete successful') }
          else        { res.send('no book exists') } })
        .catch( (error)   => { res.send('no book exists') })

      //if successful response will be 'delete successful'
    });
  
};
function findOneAndSend(_id, res) {
  Book.findOne({_id})
    .then((result) => { res.json({ _id: result._id, title: result.title, comments: result.comments, commentcount: result.commentcount }); })
    .catch((error) => { res.send('no book exists'); });
}

function buildResultAndSend(results, res) {
  const newResult = [{}]
  results.forEach((result, i) => {
    newResult[i] = result.toJSON()
    newResult[i].commentcount = result.commentcount
  })
  console.log(newResult["1"])
  res.json(newResult)
}
