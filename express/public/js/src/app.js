$(function () {

  $.fn.ajaxify_form = function (configs) {

    var $this = $(this);

    var on_response = configs.on_response || function (result) { };

    $this.submit(function (e) {

      e.preventDefault();

      var method, action, inputs;

      method = $this.attr('method');
      action = $this.attr('action');

      inputs = $('input, select, textarea', $this).not('input[type=submit], input[type=checkbox]:not(:checked)');

      var params = {};

      for (var i = 0; i < inputs.length; i++) {

        var input = $(inputs.get(i));

        var name, value;
        name  = input.attr('name');
        value = input.val();

        params[name] = value;

      }

      var ajax_options = {
        method: method,
        url   : action,
        data  : params
      }

      $.ajax(ajax_options)
      .then(on_response)
      .catch(function (err) {

         console.error(err); 

      });

      window.setTimeout(function () {

        $this.removeClass('done'); 

      }, 3000);

    });

  };

  // div of all todos
  var $todos = $('.todolist');

  function remove_todos (results) {

    $todos.empty();

    return results;

  }

  function append_todos (results) {

    if (!results.length) {

      var $message = $("<p>No todos at this time</p>");

      $todos.append($message);

      return;

    }

    for (var i = 0; i < results.length; i++) {

      var todo = results[i];

      $todo = todo_template(todo);

      $todos.append($todo);

    }


  }

  function indicate_saved ($elem) {

    $elem.addClass('saved');

    window.setTimeout(function () {

      $elem.removeClass('saved');

    }, 3000);

  }

  function fetch_todos () {

    $.ajax({
      url: "/todos"
    })
    .then(remove_todos)
    .then(append_todos);

  }

  fetch_todos();

  var new_form, update_forms, delete_forms;
  new_form     = $('form.new-todo');
  update_forms = $('form.update-todo');
  delete_forms = $('form.delete-todo');

  function update_form_template (data) {

    var $form = $('<form class="update-todo">').attr({
      action: "/todo", 
      method: "PUT" 
    });

    var $_id = $('<input>').attr({
      name : "id",
      type : "hidden",
      value: data._id,
    });

    var $done_label = $('<label for="done">Done?</label>');

    var $done = $('<input>').attr({
      name   : "done",
      type   : "checkbox",
      value  : 1,
      checked: data.done ? "checked" : null
    })
    .change(function () {

      if ($done[0].checked) {
        $done.val(1);
        return;
      }

      $done.val(0);

    });

    var $submit = $('<input>').attr({
      type : "submit",
      value: "Save",
    });

    $form.append($_id, $done_label, $done, $submit);

    $form.ajaxify_form({
      on_response: function () {
        indicate_saved($todos);
        fetch_todos();
      }
    });

    return $form;

  }

  function delete_form_template (data) {

    var $form = $('<form class="delete-todo">').attr({
      action: "/todo", 
      method: "DELETE"
    });

    var $_id = $('<input>').attr({
      name : "id",
      type : "hidden",
      value: data._id,
    });

    var $submit = $('<input>').attr({
      type : "submit",
      value: "Remove",
    });

    $form.append($_id, $submit);

    $form.ajaxify_form({
      on_response: function () {

        var $todo = $form.parent();

        $todo.removeClass('loaded');

        window.setTimeout(function () { $todo.remove() }, 1000);

      } 
    });

    return $form;

  }

  function todo_template (data) {

    var title, due_date, done;
    title    = data.title    || "";
    due_date = data.due_date || "";
    done     = data.done     || "";

    var $todo     = $('<div class="todo">');
    var $title    = $('<h3 class="field title"></h3>').html(title);
    var $due_date = $('<div class="field due-date"></div>')
      .html("Date due: " + moment(due_date).format("MM/DD/YYYY"));

    var $update_form = update_form_template(data);
    var $delete_form = delete_form_template(data);

    $todo.append($title, $due_date, $update_form, $delete_form);

    window.setTimeout(function () {

      $todo.addClass('loaded');

    }, 0);

    return $todo;

  }

  $new_form = $('form#new-todo');

  $new_form.ajaxify_form({
    on_response: fetch_todos
  });

});
