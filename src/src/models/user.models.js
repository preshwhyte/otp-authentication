const mongoose= require('mongoose')



const userSchema= new mongoose.Schema({
    username:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required:true
    },
    otp:{
        type:String
    }
},
{
    timeseries:true,
    versionKey: false
}
)

const Users = mongoose.model('User', userSchema)

module.exports= Users