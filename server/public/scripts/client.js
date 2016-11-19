$(document).ready(function() {
  console.log('jquery loaded!');

  // getting tasks from the database on load
  getTasks();

  // event functions
  $('#taskContainer').on('click', '.completeButton', function(){
    console.log($(this).parent().data('id'));
    $(this).parent().removeClass('incomplete').addClass('complete ');
    completeTask();
  });

  $('#taskContainer').on('click', '.deleteButton', function(){
    var id = $(this).parent().data('id');
    console.log('task '+ id + ' completed.');
  });

  $('#submitTask').on('click', function() {
    postTask();
    $('#taskForm').find('input').val('');
  });



}); // end doc ready

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
}

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
}

function postTask() {
  event.preventDefault();

  var task = {};

  $.each($('#taskForm').serializeArray(), function (i, field) {
        task[field.name] = field.value;
      });

      task.status = 'incomplete';

  console.log('task: ', task);

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

function completeTask() {

  var id = $(this).parent().data('id');
  console.log($(this).children());

  // make task object
  var task = {};
  task.id=id;
  task.status='complete';
  console.log(task);

  $.ajax({
    type: 'PUT',
    url: '/tasks/' + id,
    data: task,
    success: function(result) {
      console.log('completed task');
      getTasks();
    },
    error: function(result) {
      console.log('could not complete task.');
    }
  });

}
