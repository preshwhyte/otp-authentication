const Users= require('../src/models/user.models.js')
const bcrypt= require('bcryptjs')


const signup= async (req, res)=>{
    const {username, email, password} = req.body

    try{
        if (!username || !email || !password){
            return res.status(400).json({message:'all field required'})
        }

        const existingUser= await Users.findOne({email})
        if (existingUser){
            return res.status(400).json({message:'user already exist'})

        }
        const hashpassword= await bcrypt.hash(password,10)

        const otp= Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry= new Date(Date.now() + 10*60 *1000)

        const newUser= new Users({
            username,
            email,
            password: hashpassword,
            otp,
            otpExpiry,
        })

        await newUser.save()

       return res.status(201).json({message:' new user created successfully'})


    } catch(e){
        console.log(e)
        return res.status(500).json({message:' server error'})
    }
}

const login= async(req,res)=>{
    const {username, password}= req.body
    try{
        if (!username || !password){
            return res.status(400).json({message:'both fields reqiuired'})
        }
        const user= await Users.findOne({username})
        if (!user){
            return res.status(400).json({message:'not user'})
        }

        if (!user.isVerified){
            return res.status(400).json({message:'Your account has not been verified'})
        }

        const comparepass = await bcrypt.compare(password, user.password)
        if (!comparepass){
            return res.status(400).json({message:'password not correct'})
        }
        return res.status(200).json({message:'login successful'})

    } catch(e){
        console.log(e)
        return res.status(500).json({message:' server error'})

    }
}



const forgetPass= async(req,res)=>{
    const {email}= req.body

    try{
    if (!email){
        return res.status(400).json({message:'email is required'})
    }
    const user = await Users.findOne({email})
    if (!user){
        return res.status(400).json({message:'user not found'})
    }
    const otp= Math.floor(100000 + Math.random() * 900000).toString();
    const otpValid= new Date(Date.now() + 3*60 *1000)

    user.otp=otp
    user.otpValid=otpValid
    await user.save();
     return res.status(200).json({message:'otp sent to email',otp})


    } catch(e){
        console.log(e)
        return res.status(500).json({message:' server error'})

    }

}

const resetPassword = async( req,res)=>{
    const {otp, newpassword}= req.body
    try{
        if (!otp || !newpassword){
            return res.status(400).json({message:'both fields are required'})
        }
        const user= await Users.findOne({otp})
        if (!user){
             return res.status(400).json({message:'otp required'})
        }

        if (user.otpValid< new Date()){

            return res.status(400).json({message:'otp expired'}) // Returns When the otp is expired

        }

        const hashedpassword= await bcrypt.hash(newpassword,10)
        
        user.password=hashedpassword;
        user.otp=null;
        user.otpValid=null;
        await user.save()
        return res.status(200).json({message:'password reset successfully'})

    }catch(e){
           console.log(e)
        return res.status(500).json({message:' server error in reset'})

    }
}

const verifyOtp= async(req, res)=>{
    const {otp}= req.body
    try{
        if (!otp){
            return res.status(400).json({message:'OTP is required'})
        }
        const user = await Users.findOne({otp})
        if (!user){
            return res.status(400).json({message:'invalid otp entered'})
        }
        if (user.otpExpiry< new Date()){
            return res.status(400).json({message:'otp has expired'})
        }

        user.isVerified =true
        user.otp=null
        user.otpExpiry=null
        await user.save()

        return res.status(200).json({message:'otp verified successfully'})

    }catch(e){
        console.log(e)
        return res.status(500).json({message:' server error in verifyotp'})

    }
}

const resendOtp= async(req,res)=>{
    const {email}= req.body
    try{
        if (!email){
            res.status(400).json({message:'email required'})
        }

        const user = await Users.findOne({email})

        if(!user){
            res.status(400).json({message:'email not a user'})
        }

        const otp= Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry= new Date(Date.now() + 10*60 *1000)

        user.otp=otp
        user.otpExpiry= otpExpiry
        await user.save()

        return res.status(200).json({message:'otp resent successfully',otp})

    }catch(e){
        console.log(e)
        return res.status(500).json({message:' server error in verifyotp'})

    }
}


module.exports={signup, login,forgetPass, resetPassword,verifyOtp,resendOtp}