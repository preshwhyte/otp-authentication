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

        const newUser= new Users({
            username,
            email,
            password: hashpassword
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
    user.otp=otp
    await user.save();
     return res.status(400).json({message:'both fields are required'})


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
        const hashedpassword= await bcrypt.hash(newpassword,10)
        user.password=hashedpassword;
        user.otp=null;
        await user.save()
        return res.status(400).json({message:'password reset successfully'})

    }catch(e){
           console.log(e)
        return res.status(500).json({message:' server error in reset'})

    }
}

module.exports={signup, login,forgetPass, resetPassword}