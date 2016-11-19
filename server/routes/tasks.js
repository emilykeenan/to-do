var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/sigma';

router.get('/', function(req, res) {
  console.log('get request');

  // get tasks from database
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query('SELECT * FROM tasks', function(err, result) {
      done(); // close the connection.

      // console.log('the client!:', client);

      if(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      }
      res.send(result.rows);

    });

  });
}); // get request ends

router.post('/', function(req, res) {
  var newTask = req.body;
  console.log(newTask);
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query(
      'INSERT INTO tasks (description, status) ' +
      'VALUES ($1, $2)',
      [newTask.description, newTask.status],
      function(err, result) {
        done();

        if(err) {
          console.log('insert query error: ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });

  });

}); // post request ends

// router.put('/:id', function(req, res) {
//   taskID = req.params.id;
//   book = req.body;
//
//   console.log('book to update ', book);
//
//   pg.connect(connectionString, function(err, client, done) {
//     if(err) {
//       console.log('connection error: ', err);
//       res.sendStatus(500);
//     }
//
//     client.query(
//       'UPDATE books SET title=$1, author=$2, genre=$3, published=$4, edition=$5, publisher=$6' +
//       ' WHERE id=$7',
//       // array of values to use in the query above
//       [book.title, book.author, book.genre, book.published, book.edition, book.publisher, bookID],
//       function(err, result) {
//         if(err) {
//           console.log('update error: ', err);
//           res.sendStatus(500);
//         } else {
//           res.sendStatus(200);
//         }
//       });
//     }); // close connect
//
// }); // end put request



module.exports = router;
