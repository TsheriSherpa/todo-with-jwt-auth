 var express = require('express');
 var router = express.Router();
 var Todo = require('../../models/todos');
 var auth = require('../auth');



 router.get('/',auth.required,function(req, res, next) {
     Todo.findAsync({}, null, {sort: {"_id":1}})
     .then(function(todos) {
       res.json(todos);
     })
     .catch(next)
     .error(console.error);
    });

 router.post('/',auth.required,(req, res, next) =>{
    var todo = new Todo();
    todo.text = req.body.text;
    todo.done = req.body.done;
    todo.saveAsync()
    .then(function(todo) {
      console.log("success");
      res.json({'status': 'success', 'todo': todo});
    })
    .catch(function(e) {
      console.log("fail");
      res.json({'status': 'error', 'error': e});
    })
    .error(console.error);
  });


//route for read  to do http request
router.get('/:id',auth.required,(req, res, next) => {
    Todo.findOneAsync({_id: req.params.id}, {text: 1, done: 1})
    .then(function(todo) {
      res.json(todo);
    })
    .catch(next)
    .error(console.error);
  });


  //http put request to update the todo
  router.put('/:id', auth.required, (req, res, next) => {
    var todo = {};
    var prop;
    for (prop in req.body) {
      todo[prop] = req.body[prop];
    }
    Todo.updateAsync({_id: req.params.id}, todo)
    .then(function(updatedTodo) {
      return res.json({'status': 'success', 'todo': updatedTodo});
    })
    .catch(function(e){
      return res.status(400).json({'status': 'fail', 'error': e});
    });
  });


  //htttp delete request to delete the todo
  router.delete('/:id', auth.required, function(req, res, next) {
    Todo.findByIdAndRemoveAsync(req.params.id)
    .then(function(deletedTodo) {
      res.json({'status': 'success', 'todo': deletedTodo});
    })
    .catch(function(e) {
      res.status(400).json({'status': 'fail', 'error': e});
    });
  });

 //user login route

router.get('/hello', function(req, res, next){
    res.send("hello");
  });

 module.exports = router;