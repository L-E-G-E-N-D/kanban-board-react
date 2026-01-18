
const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
require('dotenv').config();

const app=express();
app.use(cors());
app.use(express.json());
const Task=require('./models/Task');

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('Connected to MongoDB'))
.catch(err=>console.error('MongoDB connection error:',err));

app.get('/health', (req, res) => {
    res.send("Backend running");
});

app.get('/tasks', async(req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});


app.post('/tasks', async(req, res) => {
    const { title } = req.body;

    const newTask = new Task({ title });
    await newTask.save();

    res.json(newTask)
})


app.patch('/tasks/:id', async(req, res) => {
    const {status}=req.body;

    const updatedTask=await Task.findByIdAndUpdate(
        req.params.id,
        {status},
        {new:true}
    );
    
    res.json(updatedTask);
})


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})