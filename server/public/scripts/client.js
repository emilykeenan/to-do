$(document).ready(function() {

  // getting tasks from the database on page load
  getTasks();

  // event functions
  $('#taskContainer').on('click', '.completeButton', completeTask);

  $('#taskContainer').on('click', '.deleteButton', deleteTask);

  $('#submitTask').on('click', function() {
    // posting a new task on submit
    postTask();

    // clearing out input after submit
    $('#taskForm').find('input').val('');

  });

}); // end doc ready

// getting existing complete and incomplete tasks from the database
// and appending them to the DOM
function getTasks() {
  $.ajax({
    type: 'GET',
    url: '/tasks',
    success: function(taskData) {
      appendTasks(taskData);
    },
    error: function() {
      console.log('Database error');
    }
  })
} // end getTasks function

// function to append tasks to the DOM, give it the data of ID and class of complete or incomplete
function appendTasks(tasks) {
  $("#taskContainer").empty();

  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    $("#taskContainer").append('<div class="task ' + task.status +  '" data-id="' + task.id + '"></div>');
    $el = $('#taskContainer').children().last();
    $el.append('<h2> ' + task.description + '</h2>');
    $el.append('<button class="completeButton">Complete</button>');
    $el.append('<button class="deleteButton">Delete</button>');
  }
} // end appendTasks function

// function to post a new task to the database and reappend tasks to the DOM
function postTask() {
  event.preventDefault();

  var task = {};

  $.each($('#taskForm').serializeArray(), function (i, field) {
    task[field.name] = field.value;
  });

  task.status = 'incomplete';

// verification to ensure no posted tasks are blank
  if(task.description == '') {
    alert('Please enter a task before submitting!');
    return false;
  }

  $.ajax({
    type: 'POST',
    url: '/tasks',
    data: task,
    success: function(response) {
      getTasks();
    },
    error: function() {
      console.log('could not post a new task');
    }
  })

} // end postTask function

// function to delete a task from the database and reappend tasks to the DOM
function deleteTask() {
  var id = $(this).parent().data('id');

// delete confirmation --- if the user does not click "ok" the function ends and never
// reaches the ajax call
  var confirmation = confirm("Are you sure you want to delete this task?");
  if (confirmation === false) {
    event.preventDefault();
    return false;
  }

  $.ajax({
    type: 'DELETE',
    url: '/tasks/' + id,
    success: function(result) {
      getTasks();
    },
    error: function(result) {
      console.log('could not delete task.');
    }
  });
} // end deleteTask function

// function to mark a task as complete and update its CSS class accordingly
function completeTask() {
  $(this).parent().removeClass('incomplete').addClass('complete ');

  var id = $(this).parent().data('id');

  var task = {};
  task.id=id;
  task.status='complete';

  $.ajax({
    type: 'PUT',
    url: '/tasks/' + id,
    data: task,
    success: function(result) {
      getTasks();
    },
    error: function(result) {
      console.log('could not complete task.');
    }
  });
} // end completeTask function
