var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var _ = require('underscore');
var path = require("path");

var mongojs = require('mongojs');

// var mongoose = require("mongoose"); // The reason for this demo.

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.  
var MONGOCONNECTION = 
  process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost:27017/co2webdb';
var db = mongojs(MONGOCONNECTION);

// // Makes connection asynchronously.  Mongoose will queue up database
// // operations and release them when the connection is complete.
// mongoose.connect(uristring, function (err, res) {
//   if (err) { 
//     console.log ('ERROR connecting to: ' + uristring + '. ' + err);
//   } else {
//     console.log ('Succeeded connected to: ' + uristring);
//   }
// });
// var db = mongoose.connection;

// db.on('error', function (err) {
// console.log('connection error', err);
// });
// db.once('open', function () {
// console.log('connected.');
// });

function mongoError(res, err) {
    if (err) console.error('mongo error ->', err);
    return res.status(500).send('internal server error')
};

function findAll(collection, query, res) {
  collection.find(
    query, function(err, docs) {
      if (err) { return mongoError(res, err); };
      // if nothing is found (doc === null) return empty array
      res.send(docs === null ? [] : docs);
    }
  );
};

app.use('/', express.static('static'));

var grid = db.collection('co2grid');
// grid data
app.get('/api/grid', function(req, res) {
    // TODO console.log(req.query.sensor_id)
    findAll(grid, {}, res);
});




app.get('/static/page1', function (req, res) {
  // res.send('Hello World!');
  res.render('index');
});

app.get('/static/page2', function (req, res) {
  // res.send('Hello World!');
  res.render('index');
});


app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
