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

router.put('/:id', function(req, res) {
  taskID = req.params.id;
  task = req.body;

  console.log('task to update ', task);

  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query(
      'UPDATE tasks SET status=$1' +
      ' WHERE id=$2',
      // array of values to use in the query above
      [task.status, taskID],
      function(err, result) {
        if(err) {
          console.log('update error: ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }); // close connect

}); // end put request



module.exports = router;
