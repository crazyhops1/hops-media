import  mongoose from 'mongoose'

const messageSchema=new mongoose.Schema({
     sender:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        require:true
    },
    receiver:{
            type:mongoose.Schema.ObjectId,
        ref:'User',
        require:true
    },
    message:{
        type:String
       
    }

},{
    timestamps:true
})
 const messageModel= new mongoose.model('Message',messageSchema)
  
 export default messageModel