const express=require('express');
const cors=require('cors');
const app=express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.send("Backend running");
});

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})