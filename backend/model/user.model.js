import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    userProfile: {
        default: '',
        type: String
    },
    userName: {
        required: true,
        unique: true,
        type: String
    },
    email: {
        required: true,
        unique: true,
        type: String
    },
    about: {
        type: String,
        minlength: [10, 'About must be at least 10 characters long'], // You should use a single `minlength`
        maxlength: [500, 'About must be at most 500 characters long'] // You might want to add a maxlength as well
    },
    password: {
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
        type: String,

    },
    followers: [
        {
            type: mongoose.Schema.ObjectId
        }
    ],
    following: [
        {
            type: mongoose.Schema.ObjectId
        }
    ],
}, { timestamps: true })

const userModel = mongoose.model('User', userSchema)
export default userModel
