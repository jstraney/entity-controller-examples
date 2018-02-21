const express = require('express');

const app = express();
const pug = require('pug');
const body_parser = require('body-parser');

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));

app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());

//// ToDo controller in action ////
const todo_controller = require('./controller');

// site index. single page app
app.get('/', async function (req, res) {

  res.render('home.pug');

});

// middleware generator
const handle_action = todo_controller.handle_action;

app.get('/todos', handle_action('read_all'));

const router = express.Router();

const route = router.route('/todo');


route.post(handle_action('create'));

route.get(handle_action('read'));

route.put(handle_action('update'));

route.delete(handle_action('delete'));

app.use(router);

const port = 3000;

app.listen(port, function () {

  console.log('express example for entity-controller started on port ' + port);

});
