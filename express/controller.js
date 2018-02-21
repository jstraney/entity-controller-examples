const controller = require('entity-controller');
const model  = require('./model');
const moment = require('moment');

const todo_controller = controller({
  resource_name : 'todo',
  actions: {
    create: {
      on_pre_query : function (params) {

        params.due_date = moment(params.due_date);

        params.done = false;

      },
      on_query: function (params) { 

        // in truth, this wrapper function
        // is not even necessary, could just pass
        // model.create as on_query value. here for
        // readability
        return model.create(params);

      }
    },
    read_all: {
      on_query: function (params) {
        return model.find({});
      }
    },
    read: {
      on_query: function (params) { 

        const id = params.id || null;

        console.log(params);

        return model.findById(id);

      }
    },
    update: {
      on_pre_query: function (params) {

        params.done = params.done? true: false;

      },
      on_query: function (params) { 

        const id = params.id || null;

        return model.findByIdAndUpdate(id, params);

      }
    },
    delete: {
      on_query: function (params) {

        const id = params.id || null;

        return model.findByIdAndRemove(id);

      }
    }
  } 
});

module.exports = todo_controller;
