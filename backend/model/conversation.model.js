import mongoose from "mongoose";


const conversationSchema= new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }],
    message:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'Message',
            default:[]
        }
    ]
    
})

const conversationModel=new mongoose.model('Conversation',conversationSchema)

export default conversationModel

