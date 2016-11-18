$(document).ready(function() {
  console.log('jquery loaded!');

  // getting tasks from the database on load
  getTasks();

  // event functions
  $('#taskContainer').on('click', '.completeButton', function(){
    var id = $(this).parent().data('id');
    console.log('task '+ id + ' completed.');
  });

  $('#taskContainer').on('click', '.deleteButton', function(){
    var id = $(this).parent().data('id');
    console.log('task '+ id + ' completed.');
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
    $("#taskContainer").append('<div class="task" data-id="' + task.id + '"></div>');
    $el = $('#taskContainer').children().last();
    $el.append('<h2> ' + task.description + '</h2>');
    $el.append('<button class="completeButton">Complete</button>');
    $el.append('<button class="deleteButton">Delete</button>');
  }
}
