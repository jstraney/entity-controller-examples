const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/todos');

mongoose.promise = global.Promise;

const ToDoSchema = mongoose.Schema({
  title    : String,
  due_date : Date,
  done     : Boolean
});

const ToDo = mongoose.model("ToDo", ToDoSchema);

// define custom methods if necessary

// can be used in controller now
module.exports = ToDo;
