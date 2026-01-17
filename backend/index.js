
const express=require('express');
const cors=require('cors');
const app=express();
app.use(cors());
app.use(express.json());


let tasks = [
  { id: 1, title: "Design UI", status: "todo" },
  { id: 2, title: "Build backend", status: "doing" },
  { id: 3, title: "Setup project", status: "done" }
];


app.get('/health', (req, res) => {
    res.send("Backend running");
});

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const { title } = req.body;
    const newTask = {
        id:Date.now(),
        title,
        status:"todo"
    };
    tasks.push(newTask);
    res.json(newTask)
})

app.patch('/tasks/:id', (req, res) => {
    const  id  = Number(req.params.id);
    const {status}=req.body
    tasks = tasks.map(task =>
        task.id === id ? { ...task, status: status } : task
    );
    const updatedTask = tasks.find(task => task.id === id);
    res.json({ success: true })
})


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})