const express= require('express')

const router= express.Router()
const {signup, login, forgetPass, resetPassword} = require('../controller/user.controller')

router.post('/signup', signup)
router.post('/login', login)
router.put('/password', forgetPass)
router.put('/reset', resetPassword)



module.exports =router