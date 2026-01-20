const mongoose=require('mongoose');

const taskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:""
    },
    status:{
        type:String,
        enum:["todo","doing","done"],
        default:"todo"
    }
},
{ timestamps: true }
);

module.exports=mongoose.model('Task',taskSchema);