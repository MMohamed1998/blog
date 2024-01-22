import mongoose, { Schema, model } from "mongoose";


const userSchema = new Schema({

    firstName:String,
    lastName:String,
    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'userName is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin','Manager']
    },

    status: {
        type: String,
        default:'offline' ,
        enum :['offline','blocked','online']
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    gender:{
        type:String,
        default:'male' ,
        enum :['male','female']
    },
    following:{
        type:[{type: mongoose.Schema.Types.ObjectId, ref:"User"}]
    },
    followers:{
        type:[{type: mongoose.Schema.Types.ObjectId, ref:"User"}]
    }

}, {
    timestamps: true
})

const userModel =mongoose.models.User || model('User', userSchema)
export default userModel