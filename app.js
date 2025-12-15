require('dotenv').config()
const express= require('express')
const app = express()
const morgan =require('morgan')
const db= require('./src/config/db')
const userRoutes= require('./src/routes/user.routes')


Port= process.env.Port

app.use(express.json())
app.use(morgan('dev'))
db()
app.use('/user', userRoutes)


app.listen(Port, ()=>{
    
    console.log(`Server is running on port ${Port}`)
})