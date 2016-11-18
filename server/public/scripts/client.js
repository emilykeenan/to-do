$(document).ready(function() {
  console.log('jquery loaded!');
  getTasks();
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
  $("#books-list").empty();

  for (var i = 0; i < tasks.length; i++) {
    $("#taskContainer").append('<div class="task"></div>');
    $el = $('#taskContainer').children().last();
    $el.append('<h2> ' + tasks[i].description + '</h2>');
    $el.append('<button class="deleteButton">Complete</button>');
    $el.append('<button class="deleteButton">Delete</button>');
  }
}
