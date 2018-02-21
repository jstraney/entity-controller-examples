## Entity-Controller Examples
This repo has examples for the entity-controller module. Right now there is just
an idiomatic "todo list" application, but it shows how an index in express can
greatly be simplified using this controller.

The real awesome part is the middleware generator which you controller can use 
for express.
```js
// note: not an exerpt from example code
// inside index.js for todo-list
// require our custom module that uses entity-controller
const controller = require('./your-controller');

// handle action is a function that generates middleware
const {handle_action} = controller;

// assumes a json response by default
route.put('/todo', handle_action('create'));
route.get('/todo', handle_action('read'));
// but you can override on_results and on_error handlers
route.post('/todo', handle_action('update', {
  on_results: function (req, res, results) {
    // send it back as xml for all i care. wait no pls 
  }
}));
route.delete('/todo', handle_action('delete'));

// ^ 'actions' being handled are just defined in controller
```

### Running Examples
first, install packages with npm
```sh
npm install
```

npm scripts have been provided to run examples. To run the express example, make sure you
have mongo running in the background and do the following:
```sh
npm run test-express
```
this should start a 'todo list' app on port 3000.
