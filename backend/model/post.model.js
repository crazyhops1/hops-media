import  mongoose from  'mongoose'
 const postSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        require:true
    },
    postImage:{
        type:String,
        require:true

    },
    description:{
        type: String,
        minlength: [10, 'About must be at least 10 characters long'], // You should use a single `minlength`
        maxlength: [500, 'About must be at most 500 characters long'] // You might want to add a maxlength as well
    },

    like:{
  type:Array
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],

 },{timestamps:true})

 const postModel= new mongoose.model('Post',postSchema)
 export default postModel