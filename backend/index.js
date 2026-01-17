
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


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})