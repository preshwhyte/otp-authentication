const express= require('express')

const router= express.Router()
const {signup, login, forgetPass, resetPassword, verifyOtp, resendOtp} = require('../controller/user.controller')

router.post('/signup', signup)
router.post('/login', login)
router.put('/password', forgetPass)
router.put('/reset', resetPassword)
router.put('/verify-otp', verifyOtp)
router.put('/resend-otp', resendOtp)



module.exports =router