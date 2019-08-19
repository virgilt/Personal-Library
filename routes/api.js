/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var mongodb = require('mongodb');
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;

//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useFindAndModify: false });


module.exports = function (app) {
  
  const Schema = new mongoose.Schema({
    title: {
      type: String,
      required: true},
    comment: Array,
    commentcount: Number
  });
  
  let Library = mongoose.model('Library', Schema);

  app.route('/api/books')
    .get((req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    
    async function findBooks() {
      try {
        let libraryInfo = await Library.find({});
        return res.json(libraryInfo);
      } catch (err) {
        res.send(`no book exists`)
      }
    }
    // let libraryInfo = await Library.find((err, data) => {
    //   if (err) err;
    //   res.json(data);
    // })
    
    findBooks();
    
    })
    
    .post((req, res) => {
      let library = req.body;
    
      async function enterBook() {
        try {
          let saveData = await Library.create({
            title: `${library.title}`,
            commentCount: 0
          });
          return res.json(saveData)
        } catch (err) {
          return res.send(`no book exists`)
        }
      }
    
      enterBook();
      //response will contain new book object including atleast _id and title
    })
    
    .delete((req, res) => {
      //if successful response will be 'complete delete successful'
      let library = req.body;
    
      async function deleteAllBooks() {
        try {
          await Library.remove({});
          return res.send(`delete successful`)
        } catch (err) {
          return res.send(`could not delete library`)
        }
      }
    
      deleteAllBooks()
    
    });



  app.route('/api/books/:id')
    .get((req, res) => {
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    console.log(bookid)
    async function specificBook() {
      try {
        let specificBook = await Library.find({_id: `${bookid}`});
        return res.json(specificBook);
      } catch (err) {
        return res.send(`no book exists`)
      }
    }  
    
    specificBook();
    
    })
    
    .post((req, res) => {
      let library = req.body;
      var bookid = req.params.id;
      var comments = req.body.comment;
    console.log(library)
      //json res format same as .get
    
    
      async function updateData() {
        try {  
          let update = await Library.findOneAndUpdate({_id: bookid}, {$push: {comment: `${comments}`}, $inc: {commentCount: 1}});
          console.log(`successfully updated ${bookid}`)
          } catch (err) {
                 return res.send(`no book exists`)
          }
        
        try {
          await Library.find({_id: `${bookid}`}, (err, data) => {
            res.json(data)
          })
        } catch (err) {
          res.send(err);
        }
      }
        
      updateData();
    
    
    })
    
    .delete(function (req, res) {
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    
      async function deleteOneBook() {
        try {
          await Library.findOneAndDelete({_id: `${bookid}`});
          return res.send(`delete sucessful`);
        } catch (err) {
          res.send(`could not delete ${bookid}`);
        }
      }
      
      deleteOneBook();
    
      
    });
  
};
