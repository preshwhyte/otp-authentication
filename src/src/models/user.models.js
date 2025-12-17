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
    },
    isValid:{
        type:Boolean,
        default: false

    },
    otpValid:{

        type:Date,
        

    },
    isVerified:{
        type:Boolean,
        default: false
    },
    otpExpiry:{
        type:Date
    }
},
{
    timeseries:true,
    versionKey: false
}
)

const Users = mongoose.model('User', userSchema)

module.exports= Users