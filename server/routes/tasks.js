var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/sigma';

// request to get the tasks from the database
router.get('/', function(req, res) {

  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query('SELECT * FROM tasks ORDER BY status DESC', function(err, result) {
      done();

      if(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      }
      res.send(result.rows);

    });

  });
}); // get request ends

// request to add a new task to the database
router.post('/', function(req, res) {

  var newTask = req.body;

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

// request to delete a task from the database
router.delete('/:id', function(req, res) {
  taskID = req.params.id;

  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query(
      'DELETE FROM tasks WHERE id = $1',
      [taskID],
      function(err, result) {
        done();

        if(err) {
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    });

}); // delete request ends

// request to update the status of a task when it is completed
router.put('/:id', function(req, res) {
  taskID = req.params.id;
  task = req.body;

  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query(
      'UPDATE tasks SET status=$1' +
      ' WHERE id=$2',
      [task.status, taskID],
      function(err, result) {
        if(err) {
          console.log('update error: ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    });

}); // end put request


module.exports = router;
