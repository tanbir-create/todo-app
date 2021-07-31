const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 7000;
const db = require('./config/mongoose');
const ToDo = require('./model/todo_db');
let moment = require('moment');
app.locals.moment = require('moment');


app.use(express.urlencoded({ extended: true})); 
app.set('view engine', 'ejs');
app.use(express.static('./assets'));
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res){
    try {
        let allTasks= await ToDo.find({}).sort('due_date');
        
        return res.render('app',{
            all_tasks: allTasks
        });
    } catch (error) {
        res.send(error);
    }
    
    
})

app.post('/new_todo', async (req, res)=>{
   try {
       let category = "";
        if(req.body.category !== "Choose Category"){
            category =  req.body.category
        }
        var due_date = req.body.due_date;
        if(req.body.due_date[0] === "" && req.body.due_date[1] === ""){
            due_date = new Date();
        }
        let newTask = await ToDo.create({
            task: req.body.task,
            category: category,
            due_date: due_date
        });

            return res.status(200).json({
                data: {
                    task: newTask
                },
                message: "Task added"
            })

   } catch (error) {
       console.log("*****",error);
       return res.redirect('back');
   }
})

app.delete('/:id', async function(req, res){
    try {
        //get id from query in the url
        let id = req.params.id;
        //find task in db using id and delete it
        let task = await ToDo.findById(id);
        
        await task.remove();

        res.send({message: "Task deleted"});

        // return res.redirect('back');
     
    } catch (error) {
        console.log("fsdfsfsf", error);
    }
    
})

app.put('/:id', async function(req, res){
    ToDo.findById(req.params.id, async function(err, todo){
        todo.isCompleted = !todo.isCompleted;

       await todo.save();

        return res.status(200).json({
            message: "Task Completed"
        })

        
    })
})





app.listen(PORT, (err)=>{
    if(err){
        console.log("error", err);
    }
    console.log('Server runnimg on port', PORT);
})
